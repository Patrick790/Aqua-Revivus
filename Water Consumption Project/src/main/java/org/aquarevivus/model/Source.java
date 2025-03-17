package org.aquarevivus.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "sources")
public class Source extends BruteEntity<Long> {

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "id_household", nullable = false)
    private Household household;

    @Column(name = "type")
    private String type;


    public Source() {}

    public Source(String name, Household household, String type) {
        this.name = name;
        this.household = household;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Household getHousehold() {
        return household;
    }

    public void setHousehold(Household household) {
        this.household = household;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}