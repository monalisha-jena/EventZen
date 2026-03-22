package com.project.EventAndBookingBackend.dto.response;

import com.project.EventAndBookingBackend.models.Event;

import java.time.LocalDateTime;

public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String venueId;
    private String venueName;
    private String vendorId;
    private String vendorName;
    private LocalDateTime eventDate;
    private Integer maxCapacity;
    private Integer currentCount;
    private Integer availableSlots;
    private Event.Category category;
    private Event.Status status;
    private Long organizerId;
    private String organizerName;
    private LocalDateTime createdAt;

    // ── Constructors ───────────────────────────────────
    public EventResponse() {
    }

    public EventResponse(Long id, String title, String description,
                         String venueId, String venueName,
                         String vendorId, String vendorName,
                         LocalDateTime eventDate,
                         Integer maxCapacity, Integer currentCount,
                         Event.Category category, Event.Status status,
                         Long organizerId, String organizerName,
                         LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.venueId = venueId;
        this.venueName = venueName;
        this.vendorId = vendorId;
        this.vendorName = vendorName;
        this.eventDate = eventDate;
        this.maxCapacity = maxCapacity;
        this.currentCount = currentCount;
        this.availableSlots = maxCapacity - currentCount;
        this.category = category;
        this.status = status;
        this.organizerId = organizerId;
        this.organizerName = organizerName;
        this.createdAt = createdAt;
    }

    // ── Getters & Setters ──────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVenueId() { return venueId; }
    public void setVenueId(String venueId) { this.venueId = venueId; }

    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }

    public String getVendorId() { return vendorId; }
    public void setVendorId(String vendorId) { this.vendorId = vendorId; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Integer getCurrentCount() { return currentCount; }
    public void setCurrentCount(Integer currentCount) { this.currentCount = currentCount; }

    public Integer getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(Integer availableSlots) { this.availableSlots = availableSlots; }

    public Event.Category getCategory() { return category; }
    public void setCategory(Event.Category category) { this.category = category; }

    public Event.Status getStatus() { return status; }
    public void setStatus(Event.Status status) { this.status = status; }

    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "EventResponse [id=" + id + ", title=" + title
                + ", venueId=" + venueId + ", vendorId=" + vendorId
                + ", eventDate=" + eventDate + ", availableSlots=" + availableSlots
                + ", category=" + category + ", status=" + status + "]";
    }
}