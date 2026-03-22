package com.project.EventAndBookingBackend.controllers;

import com.project.EventAndBookingBackend.dto.request.RegistrationRequest;
import com.project.EventAndBookingBackend.dto.response.RegistrationResponse;
import com.project.EventAndBookingBackend.services.RegistrationService;
import com.project.EventAndBookingBackend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private JwtUtil jwtUtil;

    // ── Register For Booking (Attendee) ───────────────
    @PreAuthorize("hasAuthority('ATTENDEE')")
    @PostMapping("/registrations")
    public ResponseEntity<?> registerForBooking(@RequestBody @Valid RegistrationRequest request,
                                                 HttpServletRequest httpRequest) {

        String token = httpRequest.getHeader("Authorization").substring(7);
        Long attendeeId = jwtUtil.extractUserId(token);
        String attendeeName = jwtUtil.extractName(token);
        String attendeeEmail = jwtUtil.extractEmail(token);

        RegistrationResponse response = registrationService.registerForBooking(
                request, attendeeId, attendeeName, attendeeEmail);
        return ResponseEntity.ok(response);
    }

    // ── Get My Registrations (Attendee) ───────────────
    @PreAuthorize("hasAuthority('ATTENDEE')")
    @GetMapping("/registrations/my")
    public ResponseEntity<?> getMyRegistrations(HttpServletRequest httpRequest) {

        String token = httpRequest.getHeader("Authorization").substring(7);
        Long attendeeId = jwtUtil.extractUserId(token);

        List<RegistrationResponse> responses = registrationService.getMyRegistrations(attendeeId);
        return ResponseEntity.ok(responses);
    }

    // ── Get Registration By Id (Attendee or Admin) ────
    @PreAuthorize("hasAuthority('ATTENDEE') or hasAuthority('ADMIN')")
    @GetMapping("/registrations/{id}")
    public ResponseEntity<?> getRegistrationById(@PathVariable Long id) {
        RegistrationResponse response = registrationService.getRegistrationById(id);
        return ResponseEntity.ok(response);
    }

    // ── Get Registrations By Booking (Customer + Admin)
    @PreAuthorize("hasAuthority('CUSTOMER') or hasAuthority('ADMIN')")
    @GetMapping("/registrations/booking/{bookingId}")
    public ResponseEntity<?> getRegistrationsByBookingId(@PathVariable Long bookingId) {
        List<RegistrationResponse> responses = registrationService.getRegistrationsByBookingId(bookingId);
        return ResponseEntity.ok(responses);
    }

    // ── Cancel Registration (Attendee) ────────────────
    @PreAuthorize("hasAuthority('ATTENDEE')")
    @PutMapping("/registrations/{id}/cancel")
    public ResponseEntity<?> cancelRegistration(@PathVariable Long id) {
        RegistrationResponse response = registrationService.cancelRegistration(id);
        return ResponseEntity.ok("Registration cancelled successfully " + response);
    }

    // ── Get All Registrations For Event (Admin) ───────
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/admin/registrations/event/{eventId}")
    public ResponseEntity<?> getRegistrationsByEventId(@PathVariable Long eventId) {
        List<RegistrationResponse> responses = registrationService.getRegistrationsByEventId(eventId);
        return ResponseEntity.ok(responses);
    }
}