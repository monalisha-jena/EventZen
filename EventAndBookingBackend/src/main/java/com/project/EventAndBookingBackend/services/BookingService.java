package com.project.EventAndBookingBackend.services;

import com.project.EventAndBookingBackend.dto.request.BookingRequest;
import com.project.EventAndBookingBackend.dto.response.BookingResponse;
import com.project.EventAndBookingBackend.exception.EventNotFoundException;
import com.project.EventAndBookingBackend.exception.UnauthorizedException;
import com.project.EventAndBookingBackend.models.Booking;
import com.project.EventAndBookingBackend.models.Event;
import com.project.EventAndBookingBackend.repositories.BookingRepository;
import com.project.EventAndBookingBackend.repositories.EventRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    // ── Create Booking (Customer) ─────────────────────
    public BookingResponse createBooking(BookingRequest request,
                                         Long customerId, String customerName, String customerEmail) {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID " + request.getEventId()));

        if (event.getStatus() == Event.Status.CANCELLED) {
            throw new EventNotFoundException("Event is cancelled and no longer accepting bookings");
        }

        if (event.getStatus() == Event.Status.COMPLETED) {
            throw new EventNotFoundException("Event is already completed");
        }

        if (bookingRepository.existsByEventIdAndCustomerId(request.getEventId(), customerId)) {
            throw new UnauthorizedException("You have already booked this event");
        }

        Booking booking = new Booking();
        booking.setEventId(event.getId());
        booking.setEventTitle(event.getTitle());
        booking.setCustomerId(customerId);
        booking.setCustomerName(customerName);
        booking.setCustomerEmail(customerEmail);
        booking.setStatus(Booking.Status.PENDING);
        booking.setBudget(request.getBudget());

        bookingRepository.save(booking);

        return mapToBookingResponse(booking);
    }

    // ── Get My Bookings (Customer) ────────────────────
    public List<BookingResponse> getMyBookings(Long customerId) {

        List<Booking> bookings = bookingRepository.findByCustomerId(customerId);
        List<BookingResponse> responses = new ArrayList<>();

        for (Booking booking : bookings) {
            responses.add(mapToBookingResponse(booking));
        }

        return responses;
    }

    // ── Get Booking By Id ─────────────────────────────
    public BookingResponse getBookingById(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Booking not found with ID " + id));

        return mapToBookingResponse(booking);
    }

    // ── Get All Bookings (Admin) ──────────────────────
    public List<BookingResponse> getAllBookings() {

        List<Booking> bookings = bookingRepository.findAll();
        List<BookingResponse> responses = new ArrayList<>();

        for (Booking booking : bookings) {
            responses.add(mapToBookingResponse(booking));
        }

        return responses;
    }

    // ── Get Bookings By Event (Admin) ─────────────────
    public List<BookingResponse> getBookingsByEventId(Long eventId) {

        eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException("Event not found with ID " + eventId));

        List<Booking> bookings = bookingRepository.findByEventId(eventId);
        List<BookingResponse> responses = new ArrayList<>();

        for (Booking booking : bookings) {
            responses.add(mapToBookingResponse(booking));
        }

        return responses;
    }

    // ── Approve Booking (Admin) ───────────────────────
    public BookingResponse approveBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Booking not found with ID " + id));

        if (booking.getStatus() != Booking.Status.PENDING) {
            throw new UnauthorizedException("Only pending bookings can be approved");
        }

        booking.setStatus(Booking.Status.APPROVED);
        bookingRepository.save(booking);

        return mapToBookingResponse(booking);
    }

    // ── Reject Booking (Admin) ────────────────────────
    public BookingResponse rejectBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Booking not found with ID " + id));

        if (booking.getStatus() != Booking.Status.PENDING) {
            throw new UnauthorizedException("Only pending bookings can be rejected");
        }

        booking.setStatus(Booking.Status.REJECTED);
        bookingRepository.save(booking);

        return mapToBookingResponse(booking);
    }

    // ── Cancel Booking (Customer) ─────────────────────
    public BookingResponse cancelBooking(Long id, Long customerId) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Booking not found with ID " + id));

        if (!booking.getCustomerId().equals(customerId)) {
            throw new UnauthorizedException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.Status.REJECTED) {
            throw new UnauthorizedException("Booking is already rejected");
        }

        booking.setStatus(Booking.Status.REJECTED);
        bookingRepository.save(booking);

        return mapToBookingResponse(booking);
    }

    // ── Get Approved Bookings (Attendee) ──────────────
    public List<BookingResponse> getApprovedBookings() {
        List<Booking> bookings = bookingRepository.findByStatus(Booking.Status.APPROVED);
        List<BookingResponse> responses = new ArrayList<>();
        for (Booking booking : bookings) {
            responses.add(mapToBookingResponse(booking));
        }
        return responses;
    }

    // ── Private Helper ────────────────────────────────
    private BookingResponse mapToBookingResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getEventId(),
                booking.getEventTitle(),
                booking.getCustomerId(),
                booking.getCustomerName(),
                booking.getCustomerEmail(),
                booking.getBudget(),
                booking.getStatus(),
                booking.getBookedAt()
        );
    }
}