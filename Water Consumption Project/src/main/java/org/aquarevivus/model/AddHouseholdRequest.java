package org.aquarevivus.model;

import java.util.Date;
import java.util.List;

public class AddHouseholdRequest {
    private String name;
    private String address;
    private List<PersonRequest> persons;

    private  String type;

    private String area;

    private Float surface;

    public static class PersonRequest {
        private String name;
        private Date birthDate;
        private String gender;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Date getBirthDate() {
            return birthDate;
        }

        public void setBirthDate(Date birthDate) {
            this.birthDate = birthDate;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<PersonRequest> getPersons() {
        return persons;
    }

    public void setPersons(List<PersonRequest> persons) {
        this.persons = persons;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Float getSurface() {
        return surface;
    }

    public void setSurface(Float surface) {
        this.surface = surface;
    }
}