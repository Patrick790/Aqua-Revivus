package org.aquarevivus.service;

import org.aquarevivus.model.Consumption;
import org.aquarevivus.model.ConsumptionDTO;
import org.aquarevivus.model.LastMonthConsumptionDTO;
import org.aquarevivus.model.Source;
import org.aquarevivus.persistence.IConsumptionSpringRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;

@RestController
@RequestMapping("/consumptions")
public class ConsumptionRestController {

    private final IConsumptionSpringRepository consumptionSpringRepository;
    private static final Logger logger = Logger.getLogger(ConsumptionRestController.class.getName());

    @Autowired
    public ConsumptionRestController(IConsumptionSpringRepository consumptionSpringRepository) {
        this.consumptionSpringRepository = consumptionSpringRepository;
    }

    @GetMapping("/{id}")
    public ConsumptionDTO getConsumptionById(@PathVariable Long id) {
        Optional<Consumption> opt = consumptionSpringRepository.findById(id);
        if (opt.isEmpty()) {
            return null;
        }
        Consumption c = opt.get();
        return getConsumptionDTO(c);
    }

    @GetMapping("/history/{id}")
    @PreAuthorize("hasAuthority('client')")
    public List<ConsumptionDTO> getConsumptionByLoggedInUser(@PathVariable Long id) {
        Long id_user;
        try {
            id_user = id;
            logger.info("User logged in: " + id_user);
        } catch (Exception e) {
            throw new RuntimeException("No user logged in");
        }

        // Get all consumptions, filter them by the logged-in user
        Iterable<Consumption> allConsumptions = consumptionSpringRepository.findAll();
        List<ConsumptionDTO> resultDTOs = new ArrayList<>();

        for (Consumption consumption : allConsumptions) {
            if (consumption.getSource() != null
                    && consumption.getSource().getHousehold() != null
                    && consumption.getSource().getHousehold().getUser() != null
                    && consumption.getSource().getHousehold().getUser().getId().equals(id_user))
            {
                // Convert the entity to a DTO
                ConsumptionDTO dto = getConsumptionDTO(consumption);
                resultDTOs.add(dto);
            }
        }
        return resultDTOs;
    }

    /**
     * UPDATED: Return a list of ConsumptionDTO instead of raw Consumption,
     * thus avoiding the big recursive JSON.
     */
    @GetMapping
    public List<ConsumptionDTO> getAllConsumptions() {
        Iterable<Consumption> allConsumptions = consumptionSpringRepository.findAll();
        List<ConsumptionDTO> dtos = new ArrayList<>();
        for (Consumption c : allConsumptions) {
            dtos.add(getConsumptionDTO(c));
        }
        return dtos;
    }

    @PostMapping
    public ResponseEntity<?> createConsumption(@RequestBody Map<String, Object> payload) {
        try {
            Long sourceId = ((Number) payload.get("sourceId")).longValue();
            Float amount = ((Number) payload.get("amount")).floatValue();
            String createdAtStr = (String) payload.get("createdAt");
            String untilAtStr = (String) payload.get("untilAt");

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
            Date createdAt = dateFormat.parse(createdAtStr);
            Date untilAt = dateFormat.parse(untilAtStr);

            Source source = new Source();
            source.setId(sourceId);

            Consumption consumption = new Consumption(source, amount, createdAt, untilAt);
            consumptionSpringRepository.save(consumption);

            return ResponseEntity.ok("Consumption added successfully");
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating consumption: " + e.getMessage());
        }
    }

    @GetMapping("/last")
    public ResponseEntity<ConsumptionDTO> getLastConsumptionBySource(@RequestParam Long sourceId) {
        Source source = new Source();
        source.setId(sourceId);

        Optional<Consumption> lastConsumption = consumptionSpringRepository.findTopBySourceOrderByUntilAtDesc(source);
        if (lastConsumption.isEmpty()) {
            // If there's no consumption, respond with 204 No Content
            return ResponseEntity.noContent().build();
        }

        // Convert the Consumption entity to a DTO
        Consumption c = lastConsumption.get();
        ConsumptionDTO dto = getConsumptionDTO(c);

        // Return the DTO
        return ResponseEntity.ok(dto);
    }


    @PutMapping("/{id}")
    public Consumption updateConsumption(@PathVariable Long id, @RequestBody Consumption consumption) {
        consumption.setId(id);
        return consumptionSpringRepository.save(consumption);
    }

    /**
     * Return a list of {householdId, sum of last month's consumption} for all households
     */
    @GetMapping("/lastMonthAll")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<List<LastMonthConsumptionDTO>> getLastMonthConsumptionForAllHouseholds() {
        Calendar cal = Calendar.getInstance();
        Date endDate = cal.getTime();  // "now"
        cal.add(Calendar.MONTH, -1);
        Date startDate = cal.getTime(); // "one month ago"

        Map<Long, Float> totals = new HashMap<>();
        Iterable<Consumption> allConsumptions = consumptionSpringRepository.findAll();
        for (Consumption c : allConsumptions) {
            if (c.getSource() == null) continue;
            if (c.getSource().getHousehold() == null) continue;

            Long householdId = c.getSource().getHousehold().getId();
            Date createdAt = c.getCreatedAt();
            if (createdAt == null) continue;

            // Check if createdAt is in the last month range
            if (!createdAt.before(startDate) && createdAt.before(endDate)) {
                float current = totals.getOrDefault(householdId, 0f);
                totals.put(householdId, current + c.getAmount());
            }
        }

        List<LastMonthConsumptionDTO> resultList = new ArrayList<>();
        for (Map.Entry<Long, Float> entry : totals.entrySet()) {
            resultList.add(new LastMonthConsumptionDTO(entry.getKey(), entry.getValue()));
        }

        return ResponseEntity.ok(resultList);
    }

    // Helper to convert a Consumption entity -> ConsumptionDTO
    @NotNull
    private ConsumptionDTO getConsumptionDTO(Consumption c) {
        ConsumptionDTO dto = new ConsumptionDTO();
        dto.setId(c.getId());
        dto.setAmount(c.getAmount());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUntilAt(c.getUntilAt());
        if (c.getSource() != null) {
            dto.setSourceId(c.getSource().getId());
            dto.setSourceName(c.getSource().getName());
            if (c.getSource().getHousehold() != null) {
                dto.setHouseholdId(c.getSource().getHousehold().getId());
                dto.setHouseholdName(c.getSource().getHousehold().getName());
            }
        }
        return dto;
    }
}
