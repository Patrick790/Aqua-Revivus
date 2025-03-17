package org.aquarevivus.service;

import org.aquarevivus.model.User;
import org.aquarevivus.persistence.IUserSpringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserRestController {

    private final IUserSpringRepository userSpringRepository;

    @Autowired
    public UserRestController(IUserSpringRepository userSpringRepository) {
        this.userSpringRepository = userSpringRepository;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('client', 'admin')")
    public User getUserById(@PathVariable Long id) {
        return userSpringRepository.findById(id).orElse(null);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('client', 'admin')")
    public Iterable<User> getAllUsers() {
        return userSpringRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userSpringRepository.save(user);
    }
    

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userSpringRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('client', 'admin')")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userSpringRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setGender(updatedUser.getGender());
            user.setBirthDate(updatedUser.getBirthDate());
            user.setEducation(updatedUser.getEducation());
            user.setIncome(updatedUser.getIncome());
            return userSpringRepository.save(user);
        }).orElse(null);
    }



}
