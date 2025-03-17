package org.aquarevivus.service;

import org.aquarevivus.jwtservice.JwtService;
import org.aquarevivus.jwtservice.UserInfoService;
import org.aquarevivus.model.User;
import org.aquarevivus.model.UserCredentials;
import org.aquarevivus.persistence.IUserSpringRepository;
import org.aquarevivus.jwtservice.JwtService;
import org.aquarevivus.jwtservice.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/login")
public class LoginRestController
{
    private final IUserSpringRepository userSpringRepository;

    @Autowired
    private UserInfoService service;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    public LoginRestController(IUserSpringRepository userSpringRepository) {
        this.userSpringRepository = userSpringRepository;
    }

    @PostMapping
    public User login(@RequestBody UserCredentials auth) {
        String email = auth.getEmail();
        String password = auth.getPassword();
        Optional<User> user = userSpringRepository.findByEmail(email);
        user.ifPresent(value -> UserCredentials.getInstance().setLoggedInUser(value));
        return user.orElse(null);
    }

    @PostMapping("generateToken")
    public String authenticateAndGenerateToken(@RequestBody UserCredentials auth) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(auth.getEmail(), auth.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(auth.getEmail());
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }
}