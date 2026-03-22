package com.project.EventAndBookingBackend.dto.request;

import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotNull(message = "Event ID must not be null")
    private Long eventId;
    private Double budget;

    // ── Constructors ───────────────────────────────────
    public BookingRequest() {
    }

    public BookingRequest(Long eventId) {
        this.eventId = eventId;
    }

    // ── Getters & Setters ──────────────────────────────
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    @Override
    public String toString() {
        return "BookingRequest [eventId=" + eventId + "]";
    }
}