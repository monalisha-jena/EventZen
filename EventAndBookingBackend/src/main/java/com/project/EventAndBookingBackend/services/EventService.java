package com.project.EventAndBookingBackend.services;

import com.project.EventAndBookingBackend.dto.request.EventRequest;
import com.project.EventAndBookingBackend.dto.response.EventResponse;
import com.project.EventAndBookingBackend.exception.EventNotFoundException;
import com.project.EventAndBookingBackend.models.Event;
import com.project.EventAndBookingBackend.repositories.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // ── Create Event ──────────────────────────────────
    public EventResponse createEvent(EventRequest request, Long organizerId, String organizerName) {

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenueId(request.getVenueId());
        event.setVendorId(request.getVendorId());
        event.setEventDate(request.getEventDate());
        event.setMaxCapacity(request.getMaxCapacity());
        event.setCategory(request.getCategory());
        event.setOrganizerId(organizerId);
        event.setOrganizerName(organizerName);
        event.setStatus(Event.Status.UPCOMING);
        event.setCurrentCount(0);

        eventRepository.save(event);

        // ── Fetch venue + vendor name from Service 2 ─────
        try {
            Map venueData = restTemplate.getForObject(
                    "http://localhost:3000/venues/" + request.getVenueId(),
                    Map.class);
            if (venueData != null) {
                event.setVenueName((String) venueData.get("name"));
            }
        } catch (Exception e) {
            System.out.println("[EventService] Could not fetch venue name: " + e.getMessage());
        }

        try {
            Map vendorData = restTemplate.getForObject(
                    "http://localhost:3000/vendors/" + request.getVendorId(),
                    Map.class);
            if (vendorData != null) {
                event.setVendorName((String) vendorData.get("name"));
            }
        } catch (Exception e) {
            System.out.println("[EventService] Could not fetch vendor name: " + e.getMessage());
        }

        // ── Save again with names ─────────────────────────
        eventRepository.save(event);

        // ── Mark venue + vendor as OCCUPIED ──────────────
        updateVenueServiceStatus("http://localhost:3000/vendors/internal/" + request.getVendorId() + "/status", "OCCUPIED");
        updateVenueServiceStatus("http://localhost:3000/venues/internal/" + request.getVenueId() + "/status", "OCCUPIED");

        return mapToEventResponse(event);
    }

    // ── Get All Events ────────────────────────────────
    public List<EventResponse> getAllEvents() {

        List<Event> events = eventRepository.findAll();
        List<EventResponse> responses = new ArrayList<>();

        for (Event event : events) {
            responses.add(mapToEventResponse(event));
        }

        return responses;
    }

    // ── Get Event By Id ───────────────────────────────
    public EventResponse getEventById(Long id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID " + id));

        return mapToEventResponse(event);
    }

    // ── Get Events By Status ──────────────────────────
    public List<EventResponse> getEventsByStatus(Event.Status status) {

        List<Event> events = eventRepository.findByStatus(status);
        List<EventResponse> responses = new ArrayList<>();

        for (Event event : events) {
            responses.add(mapToEventResponse(event));
        }

        return responses;
    }

    // ── Get Events By Category ────────────────────────
    public List<EventResponse> getEventsByCategory(Event.Category category) {

        List<Event> events = eventRepository.findByCategory(category);
        List<EventResponse> responses = new ArrayList<>();

        for (Event event : events) {
            responses.add(mapToEventResponse(event));
        }

        return responses;
    }

    // ── Update Event ──────────────────────────────────
    public EventResponse updateEvent(Long id, EventRequest request) {

        Event existing = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID " + id));

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setVenueId(request.getVenueId());
        existing.setVendorId(request.getVendorId());
        existing.setEventDate(request.getEventDate());
        existing.setMaxCapacity(request.getMaxCapacity());
        existing.setCategory(request.getCategory());

        eventRepository.save(existing);

        // ── Fetch venue + vendor name from Service 2 ─────
        try {
            Map venueData = restTemplate.getForObject(
                    "http://localhost:3000/venues/" + request.getVenueId(),
                    Map.class);
            if (venueData != null) {
                existing.setVenueName((String) venueData.get("name"));
            }
        } catch (Exception e) {
            System.out.println("[EventService] Could not fetch venue name: " + e.getMessage());
        }

        try {
            Map vendorData = restTemplate.getForObject(
                    "http://localhost:3000/vendors/" + request.getVendorId(),
                    Map.class);
            if (vendorData != null) {
                existing.setVendorName((String) vendorData.get("name"));
            }
        } catch (Exception e) {
            System.out.println("[EventService] Could not fetch vendor name: " + e.getMessage());
        }

        eventRepository.save(existing);


        // ── If cancelled or completed → free venue + vendor
        if (request.getStatus() != null &&
                (request.getStatus() == Event.Status.CANCELLED ||
                        request.getStatus() == Event.Status.COMPLETED)) {
            updateVenueServiceStatus("http://localhost:3000/vendors/internal/" + existing.getVendorId() + "/status", "AVAILABLE");
            updateVenueServiceStatus("http://localhost:3000/venues/internal/" + existing.getVenueId() + "/status", "AVAILABLE");
        }

        return mapToEventResponse(existing);
    }

    // ── Delete Event ──────────────────────────────────
    public boolean deleteEvent(Long id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID " + id));

        // ── Mark venue + vendor as AVAILABLE ─────────────
        updateVenueServiceStatus("http://localhost:3000/vendors/internal/" + event.getVendorId() + "/status", "AVAILABLE");
        updateVenueServiceStatus("http://localhost:3000/venues/internal/" + event.getVenueId() + "/status", "AVAILABLE");

        eventRepository.delete(event);
        return true;
    }

    // ── Helper: Call Venue Service via PATCH ──────────
    private void updateVenueServiceStatus(String url, String status) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(Map.of("status", status), headers);
            restTemplate.exchange(url, HttpMethod.PATCH, entity, String.class);
            System.out.println("[EventService] Status updated to " + status + " → " + url);
        } catch (Exception e) {
            System.out.println("[EventService] Status update failed for " + url + ": " + e.getMessage());
        }
    }

    // ── Private Helper ────────────────────────────────
    private EventResponse mapToEventResponse(Event event) {
        return new EventResponse(
            event.getId(),
            event.getTitle(),
            event.getDescription(),
            event.getVenueId(),
            event.getVenueName(),
            event.getVendorId(),
            event.getVendorName(),
            event.getEventDate(),
            event.getMaxCapacity(),
            event.getCurrentCount(),
            event.getCategory(),
            event.getStatus(),
            event.getOrganizerId(),
            event.getOrganizerName(),
            event.getCreatedAt()
        );
    }
}