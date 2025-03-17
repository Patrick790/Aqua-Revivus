package org.aquarevivus.model;

import java.util.Date;

public class PeopleDTO {

    private Long id;
    private String name;
    private Date birthDate;
    private String gender;

    public PeopleDTO() {
    }

    public PeopleDTO(Long id, String name, Date birthDate, String gender) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public String getGender() {
        return gender;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
