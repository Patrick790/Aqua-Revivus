package org.aquarevivus.model;

import java.util.Date;

public class ConsumptionDTO {

    private Long id;         // Consumption's own primary key
    private Float amount;    // e.g. 12.5
    private Date createdAt;  // e.g. 2025-01-20T10:00:00Z
    private Date untilAt;    // e.g. 2025-01-21T10:00:00Z

    private Long sourceId;       // The Source entity's ID
    private String sourceName;   // e.g. "Chiuveta"

    private Long householdId;    // The Household's ID (if you want to reference it)
    private String householdName;// e.g. "Casa Mare"

    public ConsumptionDTO() {
    }

    public ConsumptionDTO(Long id, Float amount, Date createdAt, Date untilAt,
                          Long sourceId, String sourceName,
                          Long householdId, String householdName) {
        this.id = id;
        this.amount = amount;
        this.createdAt = createdAt;
        this.untilAt = untilAt;
        this.sourceId = sourceId;
        this.sourceName = sourceName;
        this.householdId = householdId;
        this.householdName = householdName;
    }

    // --- Getters & Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public Long getHouseholdId() {
        return householdId;
    }

    public void setHouseholdId(Long householdId) {
        this.householdId = householdId;
    }

    public String getHouseholdName() {
        return householdName;
    }

    public void setHouseholdName(String householdName) {
        this.householdName = householdName;
    }
}
