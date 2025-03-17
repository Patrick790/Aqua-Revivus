package org.aquarevivus.service;

import org.aquarevivus.model.PersonType;
import org.aquarevivus.persistence.IPersonTypeSpringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/personTypes")
public class PersonTypeRestController {

    private final IPersonTypeSpringRepository personTypeSpringRepository;

    @Autowired
    public PersonTypeRestController(IPersonTypeSpringRepository personTypeSpringRepository) {
        this.personTypeSpringRepository = personTypeSpringRepository;
    }

    @GetMapping("/{id}")
    public PersonType getPersonTypeById(@PathVariable Long id) {
        return personTypeSpringRepository.findById(id).orElse(null);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('client', 'admin')")
    public Iterable<PersonType> getAllPersonTypes() {
        return personTypeSpringRepository.findAll();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping
    @PreAuthorize("hasAuthority('admin')")
    public PersonType createPersonType(@RequestBody PersonType personType) {
        return personTypeSpringRepository.save(personType);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public PersonType updatePersonType(@PathVariable Long id, @RequestBody PersonType personType) {
        personType.setId(id);
        return personTypeSpringRepository.save(personType);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public void deletePersonType(@PathVariable Long id) {
        personTypeSpringRepository.deleteById(id);
    }
}
