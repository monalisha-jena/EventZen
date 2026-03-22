package com.project.EventAndBookingBackend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.project.EventAndBookingBackend.customvalidation.FutureDateValidation;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Title must not be null or empty")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "Description must not be null or empty")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    @Column(nullable = false)
    private String description;

    // ── Venue & Vendor linked from MongoDB (Venue Service) ─
    @NotNull(message = "Venue ID must not be null")
    @Column(name = "venue_id", nullable = false)
    private String venueId;

    @Column(name = "venue_name")
    private String venueName;

    @NotNull(message = "Vendor ID must not be null")
    @Column(name = "vendor_id", nullable = false)
    private String vendorId;

    @Column(name = "vendor_name")
    private String vendorName;

    @NotNull(message = "Event date must not be null")
    @FutureDateValidation
    @Column(name = "event_date", nullable = false)
    private LocalDateTime eventDate;

    @NotNull(message = "Max capacity must not be null")
    @Min(value = 1, message = "Max capacity must be at least 1")
    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity;

    @Column(name = "current_count", nullable = false)
    private Integer currentCount = 0;

    @NotNull(message = "Category must not be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // ── Organizer details from JWT token ───────────────
    @Column(name = "organizer_id", nullable = false)
    private Long organizerId;

    @Column(name = "organizer_name", nullable = false)
    private String organizerName;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Enums ──────────────────────────────────────────
    public enum Status {
        UPCOMING,
        ONGOING,
        COMPLETED,
        CANCELLED
    }

    public enum Category {
        WORKSHOP,
        SEMINAR,
        CONFERENCE,
        NETWORKING,
        CULTURAL,
        SPORTS,
        OTHER
    }

    // ── Constructors ───────────────────────────────────
    public Event() {
    }

    public Event(Long id, String title, String description,
                 String venueId, String venueName,
                 String vendorId, String vendorName,
                 LocalDateTime eventDate, Integer maxCapacity,
                 Category category, Long organizerId, String organizerName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.venueId = venueId;
        this.venueName = venueName;
        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.eventDate = eventDate;
        this.maxCapacity = maxCapacity;
        this.category = category;
        this.organizerId = organizerId;
        this.organizerName = organizerName;
    }

    // ── Lifecycle hooks ────────────────────────────────
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = Status.UPCOMING;
        }
        if (currentCount == null) {
            currentCount = 0;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVenueId() {
        return venueId;
    }

    public void setVenueId(String venueId) {
        this.venueId = venueId;
    }

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public LocalDateTime getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDateTime eventDate) {
        this.eventDate = eventDate;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public Integer getCurrentCount() {
        return currentCount;
    }

    public void setCurrentCount(Integer currentCount) {
        this.currentCount = currentCount;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Long getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(Long organizerId) {
        this.organizerId = organizerId;
    }

    public String getOrganizerName() {
        return organizerName;
    }

    public void setOrganizerName(String organizerName) {
        this.organizerName = organizerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
        return "Event [id=" + id + ", title=" + title
                + ", venueId=" + venueId + ", vendorId=" + vendorId
                + ", eventDate=" + eventDate + ", maxCapacity=" + maxCapacity
                + ", currentCount=" + currentCount + ", category=" + category
                + ", status=" + status + ", organizerName=" + organizerName + "]";
    }
}