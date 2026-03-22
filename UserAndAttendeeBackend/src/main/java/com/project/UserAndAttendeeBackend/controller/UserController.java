package com.project.UserAndAttendeeBackend.controller;

import com.project.UserAndAttendeeBackend.dto.request.UpdateUserRequest;
import com.project.UserAndAttendeeBackend.dto.response.UserResponse;
import com.project.UserAndAttendeeBackend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // ── Get User By Id (Admin, Customer, Attendee) ────
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER') or hasAuthority('ATTENDEE')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    // ── Update User (Admin, Customer, Attendee) ───────
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('CUSTOMER') or hasAuthority('ATTENDEE')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @RequestBody @Valid UpdateUserRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok("User updated successfully " + response);
    }

    // ── Delete User (Admin only) ──────────────────────
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully " + deleted);
    }
}