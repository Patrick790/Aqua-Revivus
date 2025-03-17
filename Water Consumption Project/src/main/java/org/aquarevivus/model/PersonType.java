package org.aquarevivus.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "person_type")
public class PersonType extends BruteEntity<Long> {

    @Column(name = "lower_age")
    private Integer lowerAge;

    @Column(name = "upper_age")
    private Integer upperAge;

    @Column(name = "gender")
    private String gender;

    @Column(name = "lower_bracket")
    private Integer lowerBracket;

    @Column(name = "upper_bracket")
    private Integer upperBracket;

    @Column(name = "color_under")
    private String colorUnder;

    @Column(name = "color_between")
    private String colorBetween;

    @Column(name = "color_over")
    private String colorOver;


    public PersonType() {
    }

    public PersonType(Integer lowerAge, Integer upperAge, Integer lowerBracket, Integer upperBracket, String gender, String colorUnder, String colorBetween, String colorOver) {
        this.lowerAge = lowerAge;
        this.upperAge = upperAge;
        this.gender = gender;
        this.lowerBracket = lowerBracket;
        this.upperBracket = upperBracket;
        this.colorUnder = colorUnder;
        this.colorBetween = colorBetween;
        this.colorOver = colorOver;
    }

    public Integer getLowerAge() {
        return lowerAge;
    }

    public void setLowerAge(Integer lowerAge) {
        this.lowerAge = lowerAge;
    }

    public Integer getUpperAge() {
        return upperAge;
    }

    public void setUpperAge(Integer upperAge) {
        this.upperAge = upperAge;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getLowerBracket() {
        return lowerBracket;
    }

    public void setLowerBracket(Integer lowerBracket) {
        this.lowerBracket = lowerBracket;
    }

    public Integer getUpperBracket() {
        return upperBracket;
    }

    public void setUpperBracket(Integer upperBracket) {
        this.upperBracket = upperBracket;
    }

    public String getColorUnder() {
        return colorUnder;
    }

    public void setColorUnder(String colorUnder) {
        this.colorUnder = colorUnder;
    }

    public String getColorBetween() {
        return colorBetween;
    }

    public void setColorBetween(String colorBetween) {
        this.colorBetween = colorBetween;
    }

    public String getColorOver() {
        return colorOver;
    }

    public void setColorOver(String colorOver) {
        this.colorOver = colorOver;
    }
}
