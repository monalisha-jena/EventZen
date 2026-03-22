package com.project.EventAndBookingBackend.controllers;

import com.project.EventAndBookingBackend.dto.request.EventRequest;
import com.project.EventAndBookingBackend.dto.response.EventResponse;
import com.project.EventAndBookingBackend.models.Event;
import com.project.EventAndBookingBackend.services.EventService;
import com.project.EventAndBookingBackend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtUtil jwtUtil;

    // ── Create Event (Admin only) ─────────────────────
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody @Valid EventRequest request,
                                         HttpServletRequest httpRequest) {

        String token = httpRequest.getHeader("Authorization").substring(7);
        Long organizerId = jwtUtil.extractUserId(token);
        String organizerName = jwtUtil.extractName(token);

        EventResponse response = eventService.createEvent(request, organizerId, organizerName);
        return ResponseEntity.ok(response);
    }

    // ── Get All Events (public) ───────────────────────
    @GetMapping
    public ResponseEntity<?> getAllEvents() {
        List<EventResponse> responses = eventService.getAllEvents();
        return ResponseEntity.ok(responses);
    }

    // ── Get Event By Id (public) ──────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        EventResponse response = eventService.getEventById(id);
        return ResponseEntity.ok(response);
    }

    // ── Get Events By Status (public) ─────────────────
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getEventsByStatus(@PathVariable Event.Status status) {
        List<EventResponse> responses = eventService.getEventsByStatus(status);
        return ResponseEntity.ok(responses);
    }

    // ── Get Events By Category (public) ───────────────
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getEventsByCategory(@PathVariable Event.Category category) {
        List<EventResponse> responses = eventService.getEventsByCategory(category);
        return ResponseEntity.ok(responses);
    }

    // ── Update Event (Admin only) ─────────────────────
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id,
                                         @RequestBody @Valid EventRequest request) {
        EventResponse response = eventService.updateEvent(id, request);
        return ResponseEntity.ok("Event updated successfully " + response);
    }

    // ── Delete Event (Admin only) ─────────────────────
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        boolean deleted = eventService.deleteEvent(id);
        return ResponseEntity.ok("Event deleted successfully " + deleted);
    }
}