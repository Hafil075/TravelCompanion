package dev.hafil.travelCompanion.ai;

import java.util.List;

public class AiSuggestionResponse {

    private List<String> places;
    private List<String> items;

    public List<String> getPlaces() {
        return places;
    }

    public void setPlaces(List<String> places) {
        this.places = places;
    }

    public List<String> getItems() {
        return items;
    }

    public void setItems(List<String> items) {
        this.items = items;
    }
}
