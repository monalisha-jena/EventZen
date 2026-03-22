package com.project.EventAndBookingBackend.repositories;

import com.project.EventAndBookingBackend.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByEventId(Long eventId);

    List<Booking> findByStatus(Booking.Status status);

    Optional<Booking> findByEventIdAndCustomerId(Long eventId, Long customerId);

    Boolean existsByEventIdAndCustomerId(Long eventId, Long customerId);
}