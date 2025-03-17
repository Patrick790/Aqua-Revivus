package org.aquarevivus.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "consumptions")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Consumption extends BruteEntity<Long> {


    @ManyToOne
    @JoinColumn(name = "source_id")
    private Source source;

    @Column(name = "amount")
    private Float amount;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "until_at")
    private Date untilAt;

    public Consumption() {
    }

    public Consumption(Source source, Float amount, Date untilAt) {
        this.source = source;
        this.amount = amount;
        this.untilAt = untilAt;
    }

    public Consumption(Source source, Float amount, Date createdAt, Date untilAt) {
        this.source = source;
        this.amount = amount;
        this.createdAt = createdAt;
        this.untilAt = untilAt;
    }

    public Source getSource() {
        return source;
    }

    public void setSource(Source source) {
        this.source = source;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUntilAt() {
        return untilAt;
    }

    public void setUntilAt(Date untilAt) {
        this.untilAt = untilAt;
    }




}
