package com.project.EventAndBookingBackend.dto.response;

import com.project.EventAndBookingBackend.models.Booking;

import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Double budget;
    private Booking.Status status;
    private LocalDateTime bookedAt;


    // ── Constructors ───────────────────────────────────
    public BookingResponse() {
    }

    public BookingResponse(Long id, Long eventId, String eventTitle,
                           Long customerId, String customerName,
                           String customerEmail, Double budget, Booking.Status status,
                           LocalDateTime bookedAt) {
        this.id = id;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.budget = budget;
        this.status = status;
        this.bookedAt = bookedAt;
    }

    // ── Getters & Setters ──────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public Booking.Status getStatus() { return status; }
    public void setStatus(Booking.Status status) { this.status = status; }

    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }

    @Override
    public String toString() {
        return "BookingResponse [id=" + id + ", eventId=" + eventId
                + ", eventTitle=" + eventTitle + ", customerName=" + customerName
                + ", budget=" + budget + ", status=" + status + ", bookedAt=" + bookedAt + "]";
    }
}