package org.aquarevivus.service;

import org.aquarevivus.model.Feedback;
import org.aquarevivus.model.User;
import org.aquarevivus.persistence.IFeedbackSpringRepository;
import org.aquarevivus.persistence.IUserSpringRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackRestController {

    private final IFeedbackSpringRepository feedbackSpringRepository;
    private final IUserSpringRepository userSpringRepository;

    @Autowired
    public FeedbackRestController(IFeedbackSpringRepository feedbackSpringRepository, IUserSpringRepository userSpringRepository) {
        this.feedbackSpringRepository = feedbackSpringRepository;
        this.userSpringRepository = userSpringRepository;
    }

    @GetMapping("/{id}")
    public Feedback getFeedbackById(@PathVariable Long id) {
        return feedbackSpringRepository.findById(id).orElse(null);
    }

    @GetMapping("/history")
    @PreAuthorize("hasAuthority('client')")
    public List<Feedback> getChatHistory(@RequestParam("from") Long from, @RequestParam("to") Long to) {
        List<Feedback> allFeedbacks;
        allFeedbacks = (List<Feedback>) feedbackSpringRepository.findAll();

        // Filter feedbacks to get only the relevant ones between the two users
        allFeedbacks.removeIf(feedback ->
                !(feedback.getFrom().getId().equals(from) && feedback.getTo().getId().equals(to)) &&
                        !(feedback.getFrom().getId().equals(to) && feedback.getTo().getId().equals(from))
        );

        // Sort the feedback list by timestamp (ascending order)
        allFeedbacks.sort(Comparator.comparing(Feedback::getTimestamp));

        return allFeedbacks;
    }


    @PostMapping
    @PreAuthorize("hasAuthority('client')")
    public ResponseEntity<List<Feedback>> createFeedbacks(@RequestBody Map<String, Object> payload) {
        Long fromId = Long.valueOf(payload.get("from").toString());
        List<Long> toIds = (List<Long>) payload.get("toIds");
        String message = payload.get("message").toString();

        // Fetch sender and recipients from the database
        User fromUser = userSpringRepository.findById(fromId).orElseThrow(() -> new RuntimeException("Sender not found"));
        List<User> recipients = (List<User>) userSpringRepository.findAllById(toIds);

        // Create Feedback messages for each recipient
        List<Feedback> feedbacks = new ArrayList<>();
        for (User toUser : recipients) {
            Feedback feedback = new Feedback(fromUser, toUser, message, new Date());
            feedbacks.add(feedbackSpringRepository.save(feedback));
        }

        return ResponseEntity.ok(feedbacks);
    }


    @GetMapping
    public Iterable<Feedback> getAllFeedbacks() {
        return feedbackSpringRepository.findAll();
    }
}
