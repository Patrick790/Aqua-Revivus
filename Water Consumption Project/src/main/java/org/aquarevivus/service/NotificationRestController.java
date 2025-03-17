package org.aquarevivus.service;

import org.aquarevivus.model.Notification;
import org.aquarevivus.model.User;
import org.aquarevivus.persistence.INotificationSpringRepository;
import org.aquarevivus.persistence.IUserSpringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.aquarevivus.service.EmailService;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/notifications")
public class NotificationRestController {

    private final INotificationSpringRepository notificationSpringRepository;
    private final IUserSpringRepository userSpringRepository;
    private final EmailService emailService; // Inject EmailService here

    @Autowired
    public NotificationRestController(INotificationSpringRepository notificationSpringRepository,
                                      IUserSpringRepository userSpringRepository,
                                      EmailService emailService) {  // Add EmailService to constructor
        this.notificationSpringRepository = notificationSpringRepository;
        this.userSpringRepository = userSpringRepository;
        this.emailService = emailService;  // Assign the injected EmailService
    }

    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationSpringRepository.findById(id).orElse(null);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('admin')")
    public Notification createNotification(@RequestBody Notification notification) {
        Iterable<User> users = userSpringRepository.findAll();
        boolean sent = false;
        List<String> bcc = new ArrayList<>();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setSubject(notification.getSubject());
        message.setText(notification.getBody());
        message.setFrom("aqua.revivus@outlook.com");
        for (User user : users) {
            if (Objects.equals(user.getUserType(), "client")) {
                bcc.add(user.getEmail());
                sent = false;
            }
            if(bcc.size() == 50){
                String[] bccList = bcc.toArray(new String[bcc.size()]);
                message.setBcc(bccList);
                emailService.mailSender.send(message);
                bcc = new ArrayList<>();
                message = new SimpleMailMessage();
                message.setSubject(notification.getSubject());
                message.setText(notification.getBody());
                message.setFrom("aqua.revivus@outlook.com");
                sent = true;
            }
        }
        if(!sent){
            String[] bccList = bcc.toArray(new String[bcc.size()]);
            message.setBcc(bccList);
            emailService.mailSender.send(message);
        }
        return notificationSpringRepository.save(notification);
    }

    @GetMapping
    @PreAuthorize("hasAuthority('client')")
    public Iterable<Notification> getAllNotifications() {
        return notificationSpringRepository.findAll();
    }
}
