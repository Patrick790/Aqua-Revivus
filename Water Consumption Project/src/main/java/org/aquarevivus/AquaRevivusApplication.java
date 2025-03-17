package org.aquarevivus;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Properties;

@SpringBootApplication
public class AquaRevivusApplication {

    public static void main(String[] args) {
        SpringApplication.run(AquaRevivusApplication.class, args);
    }

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.zoho.eu");  // Use Outlook SMTP server
        mailSender.setPort(587);  // Use port 587 for STARTTLS
        mailSender.setUsername("aquarevivus@zohomail.eu");  // Your Outlook email
        mailSender.setPassword("AquaRevivus.2025");  // Your Outlook password or app password

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");


        return mailSender;
    }


    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/households/**").allowedOrigins("http://localhost:3000").allowedMethods("GET", "POST", "PUT", "DELETE");
                registry.addMapping("/users/**").allowedOrigins("http://localhost:3000").allowedMethods("GET", "POST", "PUT", "DELETE");
                registry.addMapping("/feedbacks/**").allowedOrigins("http://localhost:3000").allowedMethods("GET", "POST", "PUT", "DELETE");
                registry.addMapping("/feedbacks/history/**").allowedOrigins("http://localhost:3000").allowedMethods("GET", "POST", "PUT", "DELETE");
                registry.addMapping("/login").allowedOrigins("http://localhost:3000");
                registry.addMapping("/register").allowedOrigins("http://localhost:3000");
                registry.addMapping("/personTypes/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);

                registry.addMapping("/households").allowedOrigins("http://localhost:3000");
                registry.addMapping("/households/*").allowedOrigins("http://localhost:3000");
                registry.addMapping("/consumptions").allowedOrigins("http://localhost:3000");
                registry.addMapping("/consumptions/*").allowedOrigins("http://localhost:3000");
                registry.addMapping("/consumptions/history/*").allowedOrigins("http://localhost:3000");

                registry.addMapping("/sources/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");

                registry.addMapping("/notifications").allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }
        };
    }
}
