package com.project.EventAndBookingBackend.dto.request;

import jakarta.validation.constraints.NotNull;

public class RegistrationRequest {

    @NotNull(message = "Booking ID must not be null")
    private Long bookingId;

    // ── Constructors ───────────────────────────────────
    public RegistrationRequest() {
    }

    public RegistrationRequest(Long bookingId) {
        this.bookingId = bookingId;
    }

    // ── Getters & Setters ──────────────────────────────
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    @Override
    public String toString() {
        return "RegistrationRequest [bookingId=" + bookingId + "]";
    }
}