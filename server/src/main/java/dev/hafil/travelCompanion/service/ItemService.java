package dev.hafil.travelCompanion.service;

import dev.hafil.travelCompanion.model.Item;
import dev.hafil.travelCompanion.model.Trip;
import dev.hafil.travelCompanion.repo.ItemRepository;
import dev.hafil.travelCompanion.repo.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepo;
    private final TripRepository tripRepo;

    public ItemService(ItemRepository itemRepo, TripRepository tripRepo) {
        this.itemRepo = itemRepo;
        this.tripRepo = tripRepo;
    }

    public List<Item> getItemsForTrip(Long tripId, String username) {
        Trip trip = tripRepo.findById(tripId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip Not Found"));
        if (!trip.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: this trip does not belong to you.");
        }
        return itemRepo.findByTripId(tripId);
    }

    public Item addItem(Long tripId, Item item, String username) {
        Trip trip = tripRepo.findById(tripId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip Not Found"));
        if (!trip.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: this trip does not belong to you.");
        }
        item.setTrip(trip);
        return itemRepo.save(item);
    }

    public List<Item> addItems(Long tripId, List<Item> items, String username) {
        Trip trip = tripRepo.findById(tripId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip Not Found"));
        if (!trip.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: this trip does not belong to you.");
        }
        for (Item item : items) {
            item.setTrip(trip);
        }

        return itemRepo.saveAll(items);
    }

    public Item updateItem(Long tripId, Long itemId, Item updated, String username) {
        Trip trip = tripRepo.findById(tripId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip Not Found"));
        if (!trip.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: this trip does not belong to you.");
        }
        return itemRepo.findById(itemId).map(i -> {
            i.setName(updated.getName());
            i.setPacked(updated.isPacked());
            return itemRepo.save(i);
        }).orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public void deleteItem(Long tripId, Long itemId, String username) {
        Trip trip = tripRepo.findById(tripId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip Not Found"));
        if (!trip.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: this trip does not belong to you.");
        }
        itemRepo.deleteById(itemId);
    }


}
