package com.project.UserAndAttendeeBackend.service;

import com.project.UserAndAttendeeBackend.dto.request.LoginRequest;
import com.project.UserAndAttendeeBackend.dto.request.RegisterRequest;
import com.project.UserAndAttendeeBackend.dto.response.AuthResponse;
import com.project.UserAndAttendeeBackend.exception.UserAlreadyExistsException;
import com.project.UserAndAttendeeBackend.exception.UserNotFoundException;
import com.project.UserAndAttendeeBackend.exception.UnauthorizedException;
import com.project.UserAndAttendeeBackend.models.User;
import com.project.UserAndAttendeeBackend.repository.UserRepository;
import com.project.UserAndAttendeeBackend.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${admin.secret}")
    private String adminSecretKey;

    // ── Register User (CUSTOMER or ATTENDEE only) ─────
    public AuthResponse registerUser(RegisterRequest request) {

        if (request.getRole() == User.Role.ADMIN) {
            throw new UnauthorizedException("Admin registration is not allowed through this endpoint");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User already exists with email " + request.getEmail());
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new UserAlreadyExistsException("User already exists with phone " + request.getPhone());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId(),
                user.getName()
        );
        return new AuthResponse(token, user.getRole().name(), "User registered successfully", user.getId(), user.getName());
    }

    // ── Register Admin ────────────────────────────────
    public AuthResponse registerAdmin(RegisterRequest request, String adminSecret) {

        if (!adminSecret.equals(adminSecretKey)) {
            throw new UnauthorizedException("Invalid admin secret key");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User already exists with email " + request.getEmail());
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new UserAlreadyExistsException("User already exists with phone " + request.getPhone());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.ADMIN);

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId(),
                user.getName()
        );
        return new AuthResponse(token, user.getRole().name(), "Admin registered successfully", user.getId(), user.getName());
    }

    // ── Login ─────────────────────────────────────────
    public AuthResponse loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email " + request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UserNotFoundException("Invalid password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId(),
                user.getName()
        );

        return new AuthResponse(token, user.getRole().name(), "Login successful", user.getId(), user.getName());
    }

    // ── Logout ────────────────────────────────────────
    public void logoutUser() {
        // JWT is stateless — logout handled on client side
    }
}