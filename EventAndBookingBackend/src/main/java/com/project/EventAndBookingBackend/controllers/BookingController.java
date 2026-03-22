package com.project.EventAndBookingBackend.controllers;

import com.project.EventAndBookingBackend.dto.request.BookingRequest;
import com.project.EventAndBookingBackend.dto.response.BookingResponse;
import com.project.EventAndBookingBackend.services.BookingService;
import com.project.EventAndBookingBackend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtUtil jwtUtil;

    // ── Create Booking (Customer) ─────────────────────
    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(@RequestBody @Valid BookingRequest request,
                                           HttpServletRequest httpRequest) {

        String token = httpRequest.getHeader("Authorization").substring(7);
        Long customerId = jwtUtil.extractUserId(token);
        String customerName = jwtUtil.extractName(token);
        String customerEmail = jwtUtil.extractEmail(token);

        BookingResponse response = bookingService.createBooking(request, customerId, customerName, customerEmail);
        return ResponseEntity.ok(response);
    }

    // ── Get My Bookings (Customer) ────────────────────
    @PreAuthorize("hasAuthority('CUSTOMER')")
    @GetMapping("/bookings/my")
    public ResponseEntity<?> getMyBookings(HttpServletRequest httpRequest) {

        String token = httpRequest.getHeader("Authorization").substring(7);
        Long customerId = jwtUtil.extractUserId(token);

        List<BookingResponse> responses = bookingService.getMyBookings(customerId);
        return ResponseEntity.ok(responses);
    }

    // ── Get Booking By Id (Customer or Admin) ─────────
    @PreAuthorize("hasAuthority('CUSTOMER') or hasAuthority('ADMIN')")
    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }

    // ── Cancel Booking (Customer) ─────────────────────
    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PutMapping("/bookings/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id,
                                           HttpServletRequest httpRequest) {

        String token = httpRequest.getHeader("Authorization").substring(7);
        Long customerId = jwtUtil.extractUserId(token);

        BookingResponse response = bookingService.cancelBooking(id, customerId);
        return ResponseEntity.ok("Booking cancelled successfully " + response);
    }

    // ── Get All Bookings (Admin) ──────────────────────
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/bookings")
    public ResponseEntity<?> getAllBookings() {
        List<BookingResponse> responses = bookingService.getAllBookings();
        return ResponseEntity.ok(responses);
    }

    // ── Get Bookings By Event (Admin) ─────────────────
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/bookings/event/{eventId}")
    public ResponseEntity<?> getBookingsByEventId(@PathVariable Long eventId) {
        List<BookingResponse> responses = bookingService.getBookingsByEventId(eventId);
        return ResponseEntity.ok(responses);
    }

    // ── Approve Booking (Admin) ───────────────────────
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/admin/bookings/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        BookingResponse response = bookingService.approveBooking(id);
        return ResponseEntity.ok("Booking approved successfully " + response);
    }

    // ── Reject Booking (Admin) ────────────────────────
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/admin/bookings/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long id) {
        BookingResponse response = bookingService.rejectBooking(id);
        return ResponseEntity.ok("Booking rejected successfully " + response);
    }

    // ── Get Approved Bookings (Attendee) ──────────────
    @PreAuthorize("hasAuthority('ATTENDEE')")
    @GetMapping("/bookings/approved")
    public ResponseEntity<?> getApprovedBookings() {
        List<BookingResponse> responses = bookingService.getApprovedBookings();
        return ResponseEntity.ok(responses);
    }
}