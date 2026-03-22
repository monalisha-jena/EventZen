package com.project.EventAndBookingBackend.dto.response;

import com.project.EventAndBookingBackend.models.Registration;

import java.time.LocalDateTime;

public class RegistrationResponse {

    private Long id;
    private Long bookingId;
    private Long eventId;
    private String eventTitle;
    private Long attendeeId;
    private String attendeeName;
    private String attendeeEmail;
    private Registration.Status status;
    private Integer waitlistPosition;
    private LocalDateTime registeredAt;

    // ── Constructors ───────────────────────────────────
    public RegistrationResponse() {
    }

    public RegistrationResponse(Long id, Long bookingId, Long eventId, String eventTitle,
                                 Long attendeeId, String attendeeName,
                                 String attendeeEmail, Registration.Status status,
                                 Integer waitlistPosition, LocalDateTime registeredAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.attendeeId = attendeeId;
        this.attendeeName = attendeeName;
        this.attendeeEmail = attendeeEmail;
        this.status = status;
        this.waitlistPosition = waitlistPosition;
        this.registeredAt = registeredAt;
    }

    // ── Getters & Setters ──────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }

    public Long getAttendeeId() { return attendeeId; }
    public void setAttendeeId(Long attendeeId) { this.attendeeId = attendeeId; }

    public String getAttendeeName() { return attendeeName; }
    public void setAttendeeName(String attendeeName) { this.attendeeName = attendeeName; }

    public String getAttendeeEmail() { return attendeeEmail; }
    public void setAttendeeEmail(String attendeeEmail) { this.attendeeEmail = attendeeEmail; }

    public Registration.Status getStatus() { return status; }
    public void setStatus(Registration.Status status) { this.status = status; }

    public Integer getWaitlistPosition() { return waitlistPosition; }
    public void setWaitlistPosition(Integer waitlistPosition) { this.waitlistPosition = waitlistPosition; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    @Override
    public String toString() {
        return "RegistrationResponse [id=" + id + ", bookingId=" + bookingId
                + ", eventId=" + eventId + ", eventTitle=" + eventTitle
                + ", attendeeName=" + attendeeName + ", status=" + status
                + ", waitlistPosition=" + waitlistPosition + "]";
    }
}