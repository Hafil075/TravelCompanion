package dev.hafil.travelCompanion.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "places")
public class PlaceToVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private boolean visited = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    @JsonBackReference
    private Trip trip;

    public PlaceToVisit() {}

    public PlaceToVisit(String name, Trip trip) {
        this.name = name;
        this.trip = trip;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public boolean isVisited() {
        return visited;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setVisited(boolean visited) {
        this.visited = visited;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }
}
