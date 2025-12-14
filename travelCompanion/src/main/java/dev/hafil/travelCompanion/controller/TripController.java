package dev.hafil.travelCompanion.controller;

import dev.hafil.travelCompanion.model.Trip;
import dev.hafil.travelCompanion.service.TripService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "http://localhost:5173")
public class TripController {
    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    // list trips for current user
    @GetMapping
    public List<Trip> all(Authentication auth) {
        return tripService.getAllTripsForUser(auth.getName());
    }

    @PostMapping
    public Trip create(@RequestBody Trip trip, Authentication auth) {
        return tripService.createTrip(trip, auth.getName());
    }

    @GetMapping("/{id}")
    public Trip get(@PathVariable Long id, Authentication auth) {
        return tripService.getTrip(id, auth.getName());
    }

    @PutMapping("/{id}")
    public Trip update(@PathVariable Long id, @RequestBody Trip updated, Authentication auth) {
        return tripService.updateTrip(id, updated, auth.getName());
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        tripService.deleteTrip(id, auth.getName());
    }
}
