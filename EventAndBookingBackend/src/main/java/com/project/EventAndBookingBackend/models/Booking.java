package com.project.EventAndBookingBackend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "event_title", nullable = false)
    private String eventTitle;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Column(name = "budget")
    private Double budget;

    @Column(name = "booked_at", updatable = false)
    private LocalDateTime bookedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Enum ───────────────────────────────────────────
    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    // ── Constructors ───────────────────────────────────
    public Booking() {
    }

    public Booking(Long id, Long eventId, String eventTitle,
                   Long customerId, String customerName,
                   String customerEmail, Status status) {
        this.id = id;
        this.eventId = eventId;
        this.eventTitle = eventTitle;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.status = status;
        this.budget = budget;
    }

    // ── Lifecycle hooks ────────────────────────────────
    @PrePersist
    protected void onCreate() {
        bookedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.PENDING;
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

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
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
        return "Booking [id=" + id + ", eventId=" + eventId
                + ", eventTitle=" + eventTitle + ", customerId=" + customerId
                + ", customerName=" + customerName + ", budget=" + budget + ", status=" + status
                + ", bookedAt=" + bookedAt + "]";
    }
}