package org.aquarevivus.model;

public class SourceDTO {

    private Long id;             // Source's own ID
    private String name;         // e.g. "Ceva"
    private Long householdId;    // numeric ID of the household
    private String householdName;  // optional, if you want to show the name
    private String householdAddress; // optional
    private String type;         // e.g. "type of source"

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
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

    public String getHouseholdAddress() {
        return householdAddress;
    }
    public void setHouseholdAddress(String householdAddress) {
        this.householdAddress = householdAddress;
    }

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
}
