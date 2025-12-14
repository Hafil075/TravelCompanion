package dev.hafil.travelCompanion.ai;

import dev.hafil.travelCompanion.model.PlaceToVisit;
import dev.hafil.travelCompanion.model.Item;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class AiSuggestionService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public AiSuggestionService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = new ObjectMapper();
    }

    public AiSuggestionResponse generateSuggestions(
            String tripName,
            List<PlaceToVisit> tripPlaces,
            List<Item> tripItems,
            String destination,
            LocalDate fromDate,
            LocalDate toDate,
            int duration) {

        String prompt = buildPrompt(tripName, tripPlaces, tripItems, destination, fromDate, toDate, duration);

        String aiResponse = chatClient.prompt()
                .user(prompt)
                .call()
                .content();

        return parseResponse(aiResponse);
    }

    private String buildPrompt(
            String tripName,
            List<PlaceToVisit> tripPlaces,
            List<Item> tripItems,
            String destination,
            LocalDate fromDate,
            LocalDate toDate,
            int duration) {

        return """
                 Act as a strict, headless JSON API. You must not include any conversational text, explanations, markdown, or formatting. Output ONLY valid JSON.

                INPUT DATA:
                - Trip Name: %s
                - Destination: %s
                - Start Date: %s
                - End Date: %s
                - Duration: %d days
                - Existing Places (Exclude these): %s
                - Existing Items (Exclude these): %s

                INSTRUCTIONS:
                1. THEME ANALYSIS: Analyze the "Trip Name" to determine the intent (e.g., "Relaxing", "Adventure", "History").
                2. FEASIBILITY CHECK: Suggest NEW places that fit the destination and theme, BUT STRICTLY LIMIT the number of suggestions to what is realistically visitable within the given "Duration". Do not suggest an overwhelming number of locations for a short trip.
                3. LOGISTICS: Ensure the suggested places are geographically close enough to be visited together in the available time.
                4. PACKING: Suggest NEW items to pack based on the theme, weather, and specific activities at these places.
                5. DEDUPLICATION: You must strictly filter out any suggestions that appear in the "Existing Places" or "Existing Items" lists.
                6. FORMATTING: Return the result in raw JSON format as defined below.

                JSON SCHEMA:
                {
                  "places": [
                    "String",
                    "String"
                  ],
                  "items": [
                    "String",
                    "String"
                  ]
                }
                """
                .formatted(
                        tripName,
                        destination,
                        fromDate,
                        toDate,
                        duration,
                        tripPlaces.stream().map(PlaceToVisit::getName).toList(),
                        tripItems.stream().map(Item::getName).toList());
    }

    private AiSuggestionResponse parseResponse(String aiResponse) {
        System.out.println("RAW AI RESPONSE:");
        System.out.println(aiResponse);
        try {
            return objectMapper.readValue(aiResponse, AiSuggestionResponse.class);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Failed to parse AI response into AiSuggestionResponse");
        }
    }
}
