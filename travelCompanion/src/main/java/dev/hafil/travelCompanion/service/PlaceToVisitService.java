package dev.hafil.travelCompanion.service;

import dev.hafil.travelCompanion.model.PlaceToVisit;
import dev.hafil.travelCompanion.model.Trip;
import dev.hafil.travelCompanion.repo.PlaceToVisitRepository;
import dev.hafil.travelCompanion.repo.TripRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PlaceToVisitService {

    private final TripRepository tripRepo;
    private final PlaceToVisitRepository placeRepo;

    public PlaceToVisitService(
            TripRepository tripRepo,
            PlaceToVisitRepository placeRepo
    ) {
        this.tripRepo = tripRepo;
        this.placeRepo = placeRepo;
    }


    private Trip getOwnedTrip(Long tripId, String username) {
        Trip trip = tripRepo.findById(tripId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found")
                );

        if (!trip.getOwner().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return trip;
    }


    public List<PlaceToVisit> listPlaces(Long tripId, String username) {
        return getOwnedTrip(tripId, username).getPlacesToVisit();
    }

    public PlaceToVisit addPlace(Long tripId, PlaceToVisit place, String username) {
        Trip trip = getOwnedTrip(tripId, username);
        place.setTrip(trip);
        return placeRepo.save(place);
    }

    public List<PlaceToVisit> addPlaces(Long tripId, List<PlaceToVisit> places, String username) {
        Trip trip = getOwnedTrip(tripId, username);
        for (PlaceToVisit place : places) {
            place.setTrip(trip);
        }
        return placeRepo.saveAll(places);
    }

    public PlaceToVisit updatePlace(
            Long tripId,
            Long placeId,
            PlaceToVisit updated,
            String username
    ) {
        getOwnedTrip(tripId, username);

        PlaceToVisit place = placeRepo.findById(placeId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Place not found")
                );

        place.setName(updated.getName());
        place.setVisited(updated.isVisited());
        return placeRepo.save(place);
    }

    public void deletePlace(Long tripId, Long placeId, String username) {
        getOwnedTrip(tripId, username);
        placeRepo.deleteById(placeId);
    }

}
