package com.project.EventAndBookingBackend.repositories;

import com.project.EventAndBookingBackend.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(Event.Status status);

    List<Event> findByCategory(Event.Category category);

    List<Event> findByOrganizerId(Long organizerId);

    List<Event> findByVenueIdContainingIgnoreCase(String venueId);

    List<Event> findByTitleContainingIgnoreCase(String title);

}