package com.project.UserAndAttendeeBackend.controller;

import com.project.UserAndAttendeeBackend.dto.request.LoginRequest;
import com.project.UserAndAttendeeBackend.dto.request.RegisterRequest;
import com.project.UserAndAttendeeBackend.dto.response.AuthResponse;
import com.project.UserAndAttendeeBackend.exception.UnauthorizedException;
import com.project.UserAndAttendeeBackend.models.User;
import com.project.UserAndAttendeeBackend.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ── Register User (CUSTOMER or ATTENDEE only) ─────
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody @Valid RegisterRequest request) {
        if (request.getRole() == User.Role.ADMIN) {
            throw new UnauthorizedException("Admin registration is not permitted through this endpoint");
        }
        AuthResponse response = authService.registerUser(request);
        return ResponseEntity.ok(response);
    }

    // ── Register Admin (secret key protected) ─────────
    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody @Valid RegisterRequest request,
                                           @RequestHeader("Admin-Secret") String adminSecret) {
        AuthResponse response = authService.registerAdmin(request, adminSecret);
        return ResponseEntity.ok(response);
    }

    // ── Login ─────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody @Valid LoginRequest request) {
        AuthResponse response = authService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    // ── Logout ────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        authService.logoutUser();
        return ResponseEntity.ok("Logged out successfully");
    }
}