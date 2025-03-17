package org.aquarevivus.model;

public class UserRankingDTO {
    private final Long userId;
    private final String userName;
    private final Float totalConsumption;
    private final double minConsumption;

    public UserRankingDTO(Long userId, String userName, Float totalConsumption, double minConsumption) {
        this.userId = userId;
        this.userName = userName;
        this.totalConsumption = totalConsumption;
        this.minConsumption = minConsumption;
    }

    public String getUserName() {
        return userName;
    }

    public double getTotalConsumption() {
        return totalConsumption;
    }

    public double getMinConsumption() {
        return minConsumption;
    }

    public Long getUserId() {
        return userId;
    }

}