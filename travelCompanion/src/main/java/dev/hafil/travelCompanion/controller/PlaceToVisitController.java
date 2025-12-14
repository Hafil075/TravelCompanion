package dev.hafil.travelCompanion.controller;

import dev.hafil.travelCompanion.model.PlaceToVisit;
import dev.hafil.travelCompanion.service.PlaceToVisitService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/places")
@CrossOrigin(origins = "http://localhost:5173")
public class PlaceToVisitController {

    private final PlaceToVisitService placeService;

    public PlaceToVisitController(PlaceToVisitService placeService) {
        this.placeService = placeService;
    }

    @GetMapping
    public List<PlaceToVisit> list(
            @PathVariable Long tripId,
            Authentication auth) {
        return placeService.listPlaces(tripId, auth.getName());
    }

    @PostMapping
    public PlaceToVisit add(
            @PathVariable Long tripId,
            @RequestBody PlaceToVisit place,
            Authentication auth) {
        return placeService.addPlace(tripId, place, auth.getName());
    }

    @PostMapping("/bulk")
    public List<PlaceToVisit> add(
            @PathVariable Long tripId,
            @RequestBody List<PlaceToVisit> places,
            Authentication auth) {
        return placeService.addPlaces(tripId, places, auth.getName());
    }

    @PutMapping("/{placeId}")
    public PlaceToVisit update(
            @PathVariable Long tripId,
            @PathVariable Long placeId,
            @RequestBody PlaceToVisit updated,
            Authentication auth) {
        return placeService.updatePlace(
                tripId,
                placeId,
                updated,
                auth.getName());
    }

    @DeleteMapping("/{placeId}")
    public void delete(
            @PathVariable Long tripId,
            @PathVariable Long placeId,
            Authentication auth) {
        placeService.deletePlace(tripId, placeId, auth.getName());
    }
}
