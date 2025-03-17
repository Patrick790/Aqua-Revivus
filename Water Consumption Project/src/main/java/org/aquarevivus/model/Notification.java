package org.aquarevivus.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "notifications")
public class Notification extends BruteEntity<Long> {

    @Column(name = "subject")
    private String subject;

    @Column(name = "body")
    private String body;

    public Notification() {
    }

    public Notification(String subject, String body) {
        this.subject = subject;
        this.body = body;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
