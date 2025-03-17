package org.aquarevivus.service;

import org.aquarevivus.model.Household;
import org.aquarevivus.model.Source;
import org.aquarevivus.model.SourceDTO;
import org.aquarevivus.persistence.ISourceSpringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/sources")
public class SourceRestController {

    private final ISourceSpringRepository sourceRepository;

    @Autowired
    public SourceRestController(ISourceSpringRepository sourceRepository) {
        this.sourceRepository = sourceRepository;
    }

    @GetMapping("/{id}")
    public SourceDTO getSourceById(@PathVariable Long id) {
        Source source = sourceRepository.findById(id).orElse(null);
        if (source == null) return null;

        // Build a simple DTO with only top-level info
        SourceDTO dto = new SourceDTO();
        dto.setId(source.getId());
        dto.setName(source.getName());
        if (source.getHousehold() != null) {
            dto.setHouseholdName(source.getHousehold().getName());
            dto.setHouseholdAddress(source.getHousehold().getAddress());
            // etc.
        }
        return dto;
    }

    @GetMapping
    public Iterable<Source> getAllSources() {
        return sourceRepository.findAll();
    }

    @PostMapping
    public Source createSource(@RequestBody Source source) {
        return sourceRepository.save(source);
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAuthority('client')")
    public ResponseEntity<?> addSources(@RequestBody List<SourceDTO> sources) {
        List<Source> savedSources = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (SourceDTO sourceDTO : sources) {
            try {
                Source source = new Source();
                source.setName(sourceDTO.getName());
                source.setType(sourceDTO.getType());

                Household household = new Household();
                household.setId(sourceDTO.getHouseholdId());
                source.setHousehold(household);

                savedSources.add(sourceRepository.save(source));
            } catch (Exception e) {
                String errorMessage = "Failed to save source: " + sourceDTO.getName() + " - Error: " + e.getMessage();
                errors.add(errorMessage);
            }
        }

        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .body("Some sources failed to save: " + errors);
        }

        System.out.println("Received sources: " + sources);


        return ResponseEntity.ok(savedSources);
    }



    @DeleteMapping("/{id}")
    public void deleteSource(@PathVariable Long id) {
        sourceRepository.deleteById(id);
    }

    @GetMapping("/household/{householdId}")
    @PreAuthorize("hasAuthority('client')")
    public ResponseEntity<List<SourceDTO>> getSourcesByHouseholdId(@PathVariable Long householdId) {
        List<Source> sources = sourceRepository.findByHouseholdId(householdId);
        List<SourceDTO> sourceDTOs = new ArrayList<>();

        for (Source source : sources) {
            SourceDTO dto = new SourceDTO();
            dto.setId(source.getId());
            dto.setName(source.getName());
            dto.setType(source.getType());
            dto.setHouseholdId(source.getHousehold().getId());
            sourceDTOs.add(dto);
        }

        return ResponseEntity.ok(sourceDTOs);
    }

}
