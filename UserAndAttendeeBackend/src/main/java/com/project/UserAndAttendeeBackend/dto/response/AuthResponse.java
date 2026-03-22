package com.project.UserAndAttendeeBackend.dto.response;

public class AuthResponse {

    private String token;
    private String role;
    private String message;
    private Long id;
    private String name;

    // ── Constructors ──────────────────────────────────
    public AuthResponse() {
    }

    public AuthResponse(String token, String role, String message, Long id, String name) {
        this.token = token;
        this.role = role;
        this.message = message;
        this.id = id;
        this.name = name;
    }

    // ── Getters & Setters ─────────────────────────────
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "AuthResponse [role=" + role + ", message=" + message
                + ", id=" + id + ", name=" + name + "]";
    }
}