package dev.hafil.travelCompanion.repo;

import dev.hafil.travelCompanion.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByTripId(Long tripId);
}
