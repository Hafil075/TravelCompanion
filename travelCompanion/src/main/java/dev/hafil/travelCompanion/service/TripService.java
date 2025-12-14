package dev.hafil.travelCompanion.service;

import dev.hafil.travelCompanion.model.Trip;
import dev.hafil.travelCompanion.model.User;
import dev.hafil.travelCompanion.repo.TripRepository;
import dev.hafil.travelCompanion.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepo;
    private final UserRepository userRepo;

    public TripService(TripRepository tripRepo, UserRepository userRepo) {
        this.tripRepo = tripRepo;
        this.userRepo = userRepo;
    }

    public List<Trip> getAllTripsForUser(String username) {
        return tripRepo.findByOwnerUsername(username);
    }

    public Trip createTrip(Trip trip, String username) {
        User owner = userRepo.findByUsername(username)
                .orElseThrow(() -> new dev.hafil.travelCompanion.exception.ResourceNotFoundException("User not found"));
        trip.setOwner(owner);
        return tripRepo.save(trip);
    }

    public Trip getTrip(Long id, String username) {
        Trip t = tripRepo.findById(id)
                .orElseThrow(() -> new dev.hafil.travelCompanion.exception.ResourceNotFoundException(
                        "Trip Not Found with id: " + id));
        if (!t.getOwner().getUsername().equals(username)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Access denied: this trip does not belong to you.");
        }
        return t;
    }

    public Trip updateTrip(Long id, Trip updated, String username) {
        Trip t = tripRepo.findById(id)
                .orElseThrow(() -> new dev.hafil.travelCompanion.exception.ResourceNotFoundException(
                        "Trip Not Found with id: " + id));

        if (!t.getOwner().getUsername().equals(username)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Access denied: this trip does not belong to you.");
        }
        t.setName(updated.getName());
        t.setDestination(updated.getDestination());
        return tripRepo.save(t);
    }

    public void deleteTrip(Long id, String username) {
        Trip t = tripRepo.findById(id)
                .orElseThrow(() -> new dev.hafil.travelCompanion.exception.ResourceNotFoundException(
                        "Trip Not Found with id: " + id));
        if (!t.getOwner().getUsername().equals(username)) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Access denied: this trip does not belong to you.");
        }
        tripRepo.deleteById(id);
    }
}
