package org.aquarevivus.config;

import org.aquarevivus.filter.JwtAuthFilter;
import org.aquarevivus.jwtservice.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JwtAuthFilter authFilter;
    @Bean
    public UserDetailsService userDetailsService() {
        return new UserInfoService();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csfr -> csfr.disable()).authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/login/generateToken", "/register/test").permitAll()
                        .requestMatchers("/households/addWithPeople/**").hasAuthority("client")
                        .requestMatchers(HttpMethod.OPTIONS).permitAll()
                        .requestMatchers("/households/user/**").hasAuthority("client")
                        .requestMatchers("/consumptions/history/**").hasAuthority("client")
                        .requestMatchers("/personTypes").hasAnyAuthority("client", "admin")
                        .requestMatchers("/personTypes/**").hasAuthority("admin")
                        .requestMatchers("/sources/bulk").hasAuthority("client")
                        .requestMatchers("/sources/household/**").hasAuthority("client")
                        .requestMatchers("/consumptions/last").hasAuthority("client")
                        .requestMatchers("/users").hasAnyAuthority("client", "admin")
                        .requestMatchers("/users/**").hasAnyAuthority("client", "admin")
                        .requestMatchers("/notifications").hasAnyAuthority("client", "admin")
                        .requestMatchers("/households/ranking").hasAuthority("client")
                        .requestMatchers("/households/dto").hasAuthority("admin")
                        .requestMatchers("/households/*/owner").hasAuthority("admin")
                        .requestMatchers("/households/**").hasAuthority("client")
                        .requestMatchers("/feedbacks/history").hasAuthority("client")
                        .requestMatchers("/feedbacks").hasAuthority("client")
                        .requestMatchers("/consumptions/lastMonthAll").hasAuthority("admin")
                        .anyRequest().authenticated()
                ).sessionManagement(sess ->
                        sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                ).authenticationProvider(authenticationProvider())
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
