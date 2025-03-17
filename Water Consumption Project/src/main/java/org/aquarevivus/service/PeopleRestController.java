package org.aquarevivus.service;

import org.aquarevivus.model.Household;
import org.aquarevivus.model.People;
import org.aquarevivus.model.PeopleDTO;
import org.aquarevivus.persistence.IHouseholdSpringRepository;
import org.aquarevivus.persistence.IPeopleSpringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/people")
public class PeopleRestController {

    private final IPeopleSpringRepository peopleSpringRepository;
    private final IHouseholdSpringRepository householdSpringRepository;

    @Autowired
    public PeopleRestController(IPeopleSpringRepository peopleSpringRepository, IHouseholdSpringRepository householdSpringRepository) {
        this.peopleSpringRepository = peopleSpringRepository;
        this.householdSpringRepository = householdSpringRepository;
    }

    @GetMapping("/{id}")
    public People getPeopleById(@PathVariable Long id) {
        return peopleSpringRepository.findById(id).orElse(null);
    }

    @GetMapping
    public Iterable<People> getAllPeople() {
        return peopleSpringRepository.findAll();
    }

    @PostMapping
    public People createPeople(@RequestBody People people) {
        return peopleSpringRepository.save(people);
    }
    

    @DeleteMapping("/{id}")
    public void deletePeople(@PathVariable Long id) {
        peopleSpringRepository.deleteById(id);
    }

    // GET /households/{householdId}/peopleDto
    @GetMapping("/{householdId}/peopleDto")
    public List<PeopleDTO> getPeopleByHouseholdId(@PathVariable Long householdId) {
        Household household = householdSpringRepository.findById(householdId)
                .orElseThrow(() -> new RuntimeException("No household found"));

        List<People> residents = household.getPeople();
        // Now map each People to PeopleDTO:
        return residents.stream()
                .map(p -> new PeopleDTO(
                        p.getId(),
                        p.getName(),
                        p.getBirthDate(),
                        p.getGender()
                ))
                .collect(Collectors.toList());
    }

}
