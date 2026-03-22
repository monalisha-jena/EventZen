package com.project.EventAndBookingBackend.repositories;

import com.project.EventAndBookingBackend.models.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByAttendeeId(Long attendeeId);

    List<Registration> findByBookingId(Long bookingId);

    List<Registration> findByEventId(Long eventId);

    List<Registration> findByBookingIdAndStatus(Long bookingId, Registration.Status status);

    Optional<Registration> findByBookingIdAndAttendeeId(Long bookingId, Long attendeeId);

    Boolean existsByBookingIdAndAttendeeId(Long bookingId, Long attendeeId);

    Integer countByBookingIdAndStatus(Long bookingId, Registration.Status status);
}