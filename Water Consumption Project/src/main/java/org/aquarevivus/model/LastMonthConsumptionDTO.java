package org.aquarevivus.model;

public class LastMonthConsumptionDTO {
    private Long householdId;
    private float lastMonthTotal;

    public LastMonthConsumptionDTO() { }

    public LastMonthConsumptionDTO(Long householdId, float lastMonthTotal) {
        this.householdId = householdId;
        this.lastMonthTotal = lastMonthTotal;
    }

    public Long getHouseholdId() {
        return householdId;
    }

    public void setHouseholdId(Long householdId) {
        this.householdId = householdId;
    }

    public float getLastMonthTotal() {
        return lastMonthTotal;
    }

    public void setLastMonthTotal(float lastMonthTotal) {
        this.lastMonthTotal = lastMonthTotal;
    }
}
