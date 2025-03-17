package org.aquarevivus.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "households")
public class Household extends BruteEntity<Long> {

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @ManyToOne
    @JoinColumn(name = "id_user")
    private User user;

    @ManyToMany
    @JoinTable(
            name = "living",
            joinColumns = @JoinColumn(name = "household_id"),
            inverseJoinColumns = @JoinColumn(name = "people_id")
    )

    @JsonManagedReference
    private List<People> people;

    @Column(name = "type")
    private String type;

    @Column(name = "area")
    private String area;

    @Column(name = "surface")
    private Float surface;

    public Household() {}

    public Household(String name, String address, User user, String type, String area, Float surface) {
        this.name = name;
        this.address = address;
        this.user = user;
        this.type = type;
        this.area = area;
        this.surface = surface;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<People> getPeople() {
        return people;
    }

    public void setPeople(List<People> people) {
        this.people = people;
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

    @Override
    public String toString() {
        return "Household{" +
                "id=" + getId() +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", user=" + user +
                ", people=" + people +
                ", type='" + type + '\'' +
                ", area='" + area + '\'' +
                ", surface=" + surface +
                '}';
    }
}
