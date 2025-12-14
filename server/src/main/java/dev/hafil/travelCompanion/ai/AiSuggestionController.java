package dev.hafil.travelCompanion.ai;

import dev.hafil.travelCompanion.model.Trip;
import dev.hafil.travelCompanion.repo.TripRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips/{tripId}/suggest")
public class AiSuggestionController {

        private final TripRepository tripRepository;
        private final AiSuggestionService aiSuggestionService;

        public AiSuggestionController(
                        TripRepository tripRepository,
                        AiSuggestionService aiSuggestionService) {
                this.tripRepository = tripRepository;
                this.aiSuggestionService = aiSuggestionService;
        }

        @GetMapping
        public AiSuggestionResponse suggest(
                        @PathVariable Long tripId,
                        Authentication authentication) {
                Trip trip = getOwnedTrip(tripId, authentication);

                return aiSuggestionService.generateSuggestions(
                                trip.getName(),
                                trip.getPlacesToVisit(),
                                trip.getItems(),
                                trip.getDestination(),
                                trip.getFromDate(),
                                trip.getToDate(),
                                trip.getDurationDays());
        }

        private Trip getOwnedTrip(Long tripId, Authentication auth) {
                return tripRepository.findById(tripId)
                                .filter(trip -> trip.getOwner().getUsername()
                                                .equals(auth.getName()))
                                .orElseThrow(() -> new RuntimeException("Trip not found or access denied"));
        }
}
