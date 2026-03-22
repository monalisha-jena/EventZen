package com.project.EventAndBookingBackend.dto.request;

import com.project.EventAndBookingBackend.customvalidation.FutureDateValidation;
import com.project.EventAndBookingBackend.models.Event;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class EventRequest {

    @NotNull(message = "Title must not be null or empty")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
    private String title;

    @NotNull(message = "Description must not be null or empty")
    @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
    private String description;

    @NotNull(message = "Venue ID must not be null")
    private String venueId;

    @NotNull(message = "Vendor ID must not be null")
    private String vendorId;

    @NotNull(message = "Event date must not be null")
    @FutureDateValidation
    private LocalDateTime eventDate;

    @NotNull(message = "Max capacity must not be null")
    @Min(value = 1, message = "Max capacity must be at least 1")
    private Integer maxCapacity;

    @NotNull(message = "Category must not be null")
    private Event.Category category;

    private Event.Status status;

    // ── Constructors ───────────────────────────────────
    public EventRequest() {
    }

    public EventRequest(String title, String description,
                        String venueId, String vendorId,
                        LocalDateTime eventDate, Integer maxCapacity,
                        Event.Category category) {
        this.title = title;
        this.description = description;
        this.venueId = venueId;
        this.vendorId = vendorId;
        this.eventDate = eventDate;
        this.maxCapacity = maxCapacity;
        this.category = category;
        this.status = status;
    }

    // ── Getters & Setters ──────────────────────────────
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

    public String getVendorId() {
        return vendorId;
    }

    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
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

    public Event.Category getCategory() {
        return category;
    }

    public void setCategory(Event.Category category) {
        this.category = category;
    }

    public Event.Status getStatus() {
        return status;
    }

    public void setStatus(Event.Status status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "EventRequest [title=" + title + ", venueId=" + venueId
                + ", vendorId=" + vendorId + ", eventDate=" + eventDate
                + ", maxCapacity=" + maxCapacity + ", category=" + category + ", status=" + status + "]";
    }
}