package com.project.UserAndAttendeeBackend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public class LoginRequest {

    @NotNull(message = "Email must not be null or empty")
    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Password must not be null or empty")
    private String password;

    public LoginRequest() {
    }

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginRequest [email=" + email + "]";
    }
}