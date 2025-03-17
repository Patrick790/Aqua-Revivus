package org.aquarevivus.service;

import org.aquarevivus.jwtservice.UserInfoService;
import org.aquarevivus.model.User;
import org.aquarevivus.persistence.IUserSpringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register")
public class RegisterRestController {
    @Autowired
    private UserInfoService service;

    private final IUserSpringRepository userSpringRepository;

    @Autowired
    public RegisterRestController(IUserSpringRepository userSpringRepository) {
        this.userSpringRepository = userSpringRepository;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/test")
    public String addNewUser(@RequestBody User user) {
        return service.addUser(user);
    }


}
