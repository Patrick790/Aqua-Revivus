package org.aquarevivus.model;

public class HouseholdDTO {

    private Long id;
    private String name;
    private String address;
    private int numberOfResidents;
    private String type;
    private String area;
    private Float surface;

    public HouseholdDTO(Long id, String name, String address, int numberOfResidents, String type, String area, Float surface) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.numberOfResidents = numberOfResidents;
        this.type = type;
        this.area = area;
        this.surface = surface;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setId(Long id) {
        this.id = id;
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

    public int getNumberOfResidents() {
        return numberOfResidents;
    }

    public void setNumberOfResidents(int numberOfResidents) {
        this.numberOfResidents = numberOfResidents;
    }
}
