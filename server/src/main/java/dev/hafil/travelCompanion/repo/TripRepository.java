package dev.hafil.travelCompanion.repo;

import dev.hafil.travelCompanion.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByOwnerUsername(String username);
}
