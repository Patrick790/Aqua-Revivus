package org.aquarevivus.model;

public class UserDTO {

    private Long id;
    private String name;
    private Float income; // or Double/BigDecimal if you prefer

    public UserDTO() {
    }

    public UserDTO(Long id, String name, Float income) {
        this.id = id;
        this.name = name;
        this.income = income;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Float getIncome() {
        return income;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIncome(Float income) {
        this.income = income;
    }
}
