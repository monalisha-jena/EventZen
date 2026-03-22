package com.project.EventAndBookingBackend.services;

import com.project.EventAndBookingBackend.dto.request.RegistrationRequest;
import com.project.EventAndBookingBackend.dto.response.RegistrationResponse;
import com.project.EventAndBookingBackend.exception.AlreadyRegisteredException;
import com.project.EventAndBookingBackend.exception.EventNotFoundException;
import com.project.EventAndBookingBackend.exception.RegistrationNotFoundException;
import com.project.EventAndBookingBackend.exception.UnauthorizedException;
import com.project.EventAndBookingBackend.models.Booking;
import com.project.EventAndBookingBackend.models.Event;
import com.project.EventAndBookingBackend.models.Registration;
import com.project.EventAndBookingBackend.repositories.BookingRepository;
import com.project.EventAndBookingBackend.repositories.EventRepository;
import com.project.EventAndBookingBackend.repositories.RegistrationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    // ── Register For Booking (Attendee) ───────────────
    public RegistrationResponse registerForBooking(RegistrationRequest request,
                                                    Long attendeeId, String attendeeName, String attendeeEmail) {

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new EventNotFoundException("Booking not found with ID " + request.getBookingId()));

        if (booking.getStatus() != Booking.Status.APPROVED) {
            throw new UnauthorizedException("You can only register for approved bookings");
        }

        Event event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID " + booking.getEventId()));

        if (event.getStatus() == Event.Status.CANCELLED) {
            throw new EventNotFoundException("Event is cancelled and no longer accepting registrations");
        }

        if (event.getStatus() == Event.Status.COMPLETED) {
            throw new EventNotFoundException("Event is already completed");
        }

        Optional<Registration> existingRegistration = registrationRepository
                .findByBookingIdAndAttendeeId(request.getBookingId(), attendeeId);

        if (existingRegistration.isPresent() &&
                existingRegistration.get().getStatus() != Registration.Status.CANCELLED) {
            throw new AlreadyRegisteredException("You are already registered for this booking");
        }

        Registration registration = new Registration();
        registration.setBookingId(booking.getId());
        registration.setEventId(event.getId());
        registration.setEventTitle(event.getTitle());
        registration.setAttendeeId(attendeeId);
        registration.setAttendeeName(attendeeName);
        registration.setAttendeeEmail(attendeeEmail);

        // ── Capacity check — confirmed or waitlisted ──
        if (event.getCurrentCount() < event.getMaxCapacity()) {

            registration.setStatus(Registration.Status.CONFIRMED);
            registration.setWaitlistPosition(null);

            event.setCurrentCount(event.getCurrentCount() + 1);
            eventRepository.save(event);

        } else {

            Integer waitlistCount = registrationRepository.countByBookingIdAndStatus(
                    request.getBookingId(), Registration.Status.WAITLISTED);

            registration.setStatus(Registration.Status.WAITLISTED);
            registration.setWaitlistPosition(waitlistCount + 1);
        }

        registrationRepository.save(registration);

        return mapToRegistrationResponse(registration);
    }

    // ── Get My Registrations (Attendee) ───────────────
    public List<RegistrationResponse> getMyRegistrations(Long attendeeId) {

        List<Registration> registrations = registrationRepository.findByAttendeeId(attendeeId);
        List<RegistrationResponse> responses = new ArrayList<>();

        for (Registration registration : registrations) {
            responses.add(mapToRegistrationResponse(registration));
        }

        return responses;
    }

    // ── Get Registration By Id ────────────────────────
    public RegistrationResponse getRegistrationById(Long id) {

        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RegistrationNotFoundException("Registration not found with ID " + id));

        return mapToRegistrationResponse(registration);
    }

    // ── Get Registrations By Booking (Customer + Admin)
    public List<RegistrationResponse> getRegistrationsByBookingId(Long bookingId) {

        bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EventNotFoundException("Booking not found with ID " + bookingId));

        List<Registration> registrations = registrationRepository.findByBookingId(bookingId);
        List<RegistrationResponse> responses = new ArrayList<>();

        for (Registration registration : registrations) {
            responses.add(mapToRegistrationResponse(registration));
        }

        return responses;
    }

    // ── Get All Registrations For Event (Admin) ───────
    public List<RegistrationResponse> getRegistrationsByEventId(Long eventId) {

        eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID " + eventId));

        List<Registration> registrations = registrationRepository.findByEventId(eventId);
        List<RegistrationResponse> responses = new ArrayList<>();

        for (Registration registration : registrations) {
            responses.add(mapToRegistrationResponse(registration));
        }

        return responses;
    }

    // ── Cancel Registration (Attendee) ────────────────
    public RegistrationResponse cancelRegistration(Long id) {

        Registration registration = registrationRepository.findById(id)
                .orElseThrow(() -> new RegistrationNotFoundException("Registration not found with ID " + id));

        if (registration.getStatus() == Registration.Status.CANCELLED) {
            throw new RegistrationNotFoundException("Registration is already cancelled");
        }

        boolean wasConfirmed = registration.getStatus() == Registration.Status.CONFIRMED;

        registration.setStatus(Registration.Status.CANCELLED);
        registration.setWaitlistPosition(null);
        registrationRepository.save(registration);

        // ── Waitlist upgrade logic (your original logic) ──
        if (wasConfirmed) {

            Event event = eventRepository.findById(registration.getEventId())
                    .orElseThrow(() -> new EventNotFoundException("Event not found with ID " + registration.getEventId()));

            event.setCurrentCount(event.getCurrentCount() - 1);
            eventRepository.save(event);

            List<Registration> waitlisted = registrationRepository.findByBookingIdAndStatus(
                    registration.getBookingId(), Registration.Status.WAITLISTED);

            if (!waitlisted.isEmpty()) {

                Registration firstInWaitlist = waitlisted.get(0);
                firstInWaitlist.setStatus(Registration.Status.CONFIRMED);
                firstInWaitlist.setWaitlistPosition(null);
                registrationRepository.save(firstInWaitlist);

                for (int i = 1; i < waitlisted.size(); i++) {
                    Registration waiting = waitlisted.get(i);
                    waiting.setWaitlistPosition(i);
                    registrationRepository.save(waiting);
                }

                event.setCurrentCount(event.getCurrentCount() + 1);
                eventRepository.save(event);
            }
        }

        return mapToRegistrationResponse(registration);
    }

    // ── Private Helper ────────────────────────────────
    private RegistrationResponse mapToRegistrationResponse(Registration registration) {
        return new RegistrationResponse(
                registration.getId(),
                registration.getBookingId(),
                registration.getEventId(),
                registration.getEventTitle(),
                registration.getAttendeeId(),
                registration.getAttendeeName(),
                registration.getAttendeeEmail(),
                registration.getStatus(),
                registration.getWaitlistPosition(),
                registration.getRegisteredAt()
        );
    }
}