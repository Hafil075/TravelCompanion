package dev.hafil.travelCompanion.controller;

import dev.hafil.travelCompanion.model.Item;
import dev.hafil.travelCompanion.service.ItemService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/items")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<Item> list(@PathVariable Long tripId, Authentication auth) {
        return itemService.getItemsForTrip(tripId, auth.getName());
    }

    @PostMapping
    public Item addItem(
            @PathVariable Long tripId,
            @RequestBody Item item,
            Authentication auth) {
        return itemService.addItem(tripId, item, auth.getName());
    }

    @PostMapping("/bulk")
    public List<Item> addItems(
            @PathVariable Long tripId,
            @RequestBody List<Item> items,
            Authentication auth) {
        return itemService.addItems(tripId, items, auth.getName());
    }

    @PutMapping("/{itemId}")
    public Item update(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            @RequestBody Item updated,
            Authentication auth) {
        return itemService.updateItem(tripId, itemId, updated, auth.getName());
    }

    @DeleteMapping("/{itemId}")
    public void delete(
            @PathVariable Long tripId,
            @PathVariable Long itemId,
            Authentication auth) {
        itemService.deleteItem(tripId, itemId, auth.getName());
    }
}
