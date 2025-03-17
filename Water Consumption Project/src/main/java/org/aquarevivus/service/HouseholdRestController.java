package org.aquarevivus.service;

import org.aquarevivus.model.*;
import org.aquarevivus.persistence.IConsumptionSpringRepository;
import org.aquarevivus.persistence.IHouseholdSpringRepository;
import org.aquarevivus.persistence.IPeopleSpringRepository;
import org.aquarevivus.persistence.IUserSpringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/households")
public class HouseholdRestController {

    private final IHouseholdSpringRepository householdSpringRepository;
    private final IUserSpringRepository userSpringRepository;
    private final IPeopleSpringRepository peopleSpringRepository;
    private final IConsumptionSpringRepository consumptionSpringRepository;

    @Autowired
    public HouseholdRestController(
            IHouseholdSpringRepository householdSpringRepository,
            IUserSpringRepository userSpringRepository,
            IPeopleSpringRepository peopleSpringRepository, IConsumptionSpringRepository consumptionSpringRepository) {
        this.householdSpringRepository = householdSpringRepository;
        this.userSpringRepository = userSpringRepository;
        this.peopleSpringRepository = peopleSpringRepository;
        this.consumptionSpringRepository = consumptionSpringRepository;
    }

    @GetMapping("/{id}")
    public Household getHouseholdById(@PathVariable Long id) {
        return householdSpringRepository.findById(id).orElse(null);
    }

    @GetMapping
    public Iterable<Household> getAllHouseholds() {
        return householdSpringRepository.findAll();
    }

    // NEW endpoint that returns a list of HouseholdDTO to avoid cyclical references:
    @GetMapping("/dto")
    @PreAuthorize("hasAuthority('admin')")
    public List<HouseholdDTO> getAllHouseholdDTO() {
        List<Household> all = (List<Household>) householdSpringRepository.findAll();
        return all.stream()
                .map(h -> new HouseholdDTO(
                        h.getId(),
                        h.getName(),
                        h.getAddress(),
                        // numberOfResidents = how many People are in household
                        h.getPeople() == null ? 0 : h.getPeople().size(),
                        h.getType(),
                        h.getArea(),
                        h.getSurface()
                ))
                .collect(Collectors.toList());
    }

    @PostMapping
    public Household createHousehold(@RequestBody Household household) {
        return householdSpringRepository.save(household);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('client')")
    public void deleteHousehold(@PathVariable Long id) {
        householdSpringRepository.deleteById(id);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('client')")
    public List<HouseholdDTO> getHouseholdsByUserId(@PathVariable Long userId) {
        List<Household> households = householdSpringRepository.findByUserId(userId);
        return households.stream()
                .map(h -> new HouseholdDTO(
                        h.getId(),
                        h.getName(),
                        h.getAddress(),
                        (h.getPeople() == null) ? 0 : h.getPeople().size(),
                        h.getType(),
                        h.getArea(),
                        h.getSurface()
                ))
                .collect(Collectors.toList());
    }



    @PostMapping("/addWithPeople/{userId}")
    @PreAuthorize("hasAuthority('client')")
    public Household addHouseholdWithPeople(@PathVariable Long userId, @RequestBody AddHouseholdRequest request) {
        User user = userSpringRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        Household household = new Household();
        household.setName(request.getName());
        household.setAddress(request.getAddress());
        household.setUser(user);
        household.setPeople(new ArrayList<>());
        household.setType(request.getType());
        household.setArea(request.getArea());
        household.setSurface(request.getSurface());

        Household savedHousehold = householdSpringRepository.save(household);

        for (AddHouseholdRequest.PersonRequest personRequest : request.getPersons()) {
            People person = new People();
            person.setName(personRequest.getName());
            person.setBirthDate(personRequest.getBirthDate());
            person.setGender(personRequest.getGender());

            // Add the household to the person's list of households
            person.setHouseholds(List.of(savedHousehold));

            // Save the person
            peopleSpringRepository.save(person);

            // Add the person to the household's list of people
            savedHousehold.getPeople().add(person);
        }

        // Save the updated household with the added people
        householdSpringRepository.save(savedHousehold);

        return savedHousehold;
    }

    @GetMapping("/ranking")
//    @PreAuthorize("hasAuthority('client')")
    public List<UserRankingDTO> getUserRankings() {
        List<User> users = (List<User>) userSpringRepository.findAll();
        List<UserRankingDTO> rankings = new ArrayList<>();
        List<Consumption> allConsumptions = (List<Consumption>) consumptionSpringRepository.findAll();

        for (User user : users) {
            List<Household> households = householdSpringRepository.findByUserId(user.getId());

            // Calculate total consumption for the current month
            float totalConsumption = (float) households.stream()
                    .flatMapToDouble(h -> allConsumptions.stream()
                            .filter(c -> c.getSource().getHousehold().getId().equals(h.getId()))
                            .filter(c -> c.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getMonth() == LocalDate.now().getMonth())
                            .mapToDouble(Consumption::getAmount))
                    .sum();

            // Calculate minimum consumption since using the application
            float minConsumption = (float) households.stream()
                    .flatMapToDouble(h -> allConsumptions.stream()
                            .filter(c -> c.getSource().getHousehold().getId().equals(h.getId()))
                            .mapToDouble(Consumption::getAmount))
                    .min()
                    .orElse(0);

            rankings.add(new UserRankingDTO(user.getId(), user.getName(), totalConsumption, minConsumption));
        }

        rankings.sort(Comparator.comparingDouble(UserRankingDTO::getTotalConsumption));
        return rankings;
    }

    @GetMapping("/{householdId}/owner")
    @PreAuthorize("hasAuthority('admin')")
    public UserDTO getOwnerByHouseholdId(@PathVariable Long householdId) {
        Household h = householdSpringRepository.findById(householdId)
                .orElseThrow(() -> new RuntimeException("Household not found"));

        User owner = h.getUser();
        if (owner == null) {
            return null;
        }
        // Return minimal user info
        return new UserDTO(owner.getId(), owner.getName(), owner.getIncome());
    }

}