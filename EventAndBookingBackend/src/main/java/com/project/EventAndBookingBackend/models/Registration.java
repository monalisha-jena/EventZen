package com.project.EventAndBookingBackend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "event_title", nullable = false)
    private String eventTitle;

    @Column(name = "attendee_id", nullable = false)
    private Long attendeeId;

    @Column(name = "attendee_name", nullable = false)
    private String attendeeName;

    @Column(name = "attendee_email", nullable = false)
    private String attendeeEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "waitlist_position")
    private Integer waitlistPosition;

    @Column(name = "registered_at", updatable = false)
    private LocalDateTime registeredAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Enum ───────────────────────────────────────────
    public enum Status {
        CONFIRMED,
        WAITLISTED,
        CANCELLED
    }

    // ── Constructors ───────────────────────────────────
    public Registration() {
    }

    public Registration(Long id, Long bookingId, Long eventId, String eventTitle,
                        Long attendeeId, String attendeeName,
                        String attendeeEmail, Status status) {
        this.id = id;
        this.bookingId = bookingId;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.attendeeId = attendeeId;
        this.attendeeName = attendeeName;
        this.attendeeEmail = attendeeEmail;
        this.status = status;
    }

    // ── Lifecycle hooks ────────────────────────────────
    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.CONFIRMED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ──────────────────────────────
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public Long getAttendeeId() {
        return attendeeId;
    }

    public void setAttendeeId(Long attendeeId) {
        this.attendeeId = attendeeId;
    }

    public String getAttendeeName() {
        return attendeeName;
    }

    public void setAttendeeName(String attendeeName) {
        this.attendeeName = attendeeName;
    }

    public String getAttendeeEmail() {
        return attendeeEmail;
    }

    public void setAttendeeEmail(String attendeeEmail) {
        this.attendeeEmail = attendeeEmail;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getWaitlistPosition() {
        return waitlistPosition;
    }

    public void setWaitlistPosition(Integer waitlistPosition) {
        this.waitlistPosition = waitlistPosition;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // ── toString ───────────────────────────────────────
    @Override
    public String toString() {
        return "Registration [id=" + id + ", bookingId=" + bookingId
                + ", eventId=" + eventId + ", eventTitle=" + eventTitle
                + ", attendeeId=" + attendeeId + ", attendeeName=" + attendeeName
                + ", status=" + status + ", waitlistPosition=" + waitlistPosition + "]";
    }
}