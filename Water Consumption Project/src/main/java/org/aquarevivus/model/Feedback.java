package org.aquarevivus.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "feedbacks")
public class Feedback extends BruteEntity<Long> {

    @ManyToOne
    @JoinColumn(name = "user_from")
    private User from;

    @ManyToOne
    @JoinColumn(name = "user_to")
    private User to;

    @Column(name = "message")
    private String message;

    @Column(name = "timestamp")
    private Date timestamp;

    public Feedback() {}

    public Feedback(User from, User to, String message, Date timestamp) {
        this.from = from;
        this.to = to;
        this.message = message;
        this.timestamp = timestamp;
    }

    public User getFrom() {
        return from;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public User getTo() {
        return to;
    }

    public void setTo(User to) {
        this.to = to;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date answeredAt) {
        this.timestamp = answeredAt;
    }


}
