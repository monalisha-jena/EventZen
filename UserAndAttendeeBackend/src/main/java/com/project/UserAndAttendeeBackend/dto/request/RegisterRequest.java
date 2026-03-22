package com.project.UserAndAttendeeBackend.dto.request;

import com.project.UserAndAttendeeBackend.customvalidation.EmailValidation;
import com.project.UserAndAttendeeBackend.customvalidation.PasswordValidation;
import com.project.UserAndAttendeeBackend.customvalidation.PhoneValidation;
import com.project.UserAndAttendeeBackend.models.User;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotNull(message = "Name must not be null or empty")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String name;

    @NotNull(message = "Email must not be null or empty")
    @EmailValidation
    private String email;

    @NotNull(message = "Password must not be null or empty")
    @PasswordValidation
    private String password;

    @NotNull(message = "Phone must not be null or empty")
    @PhoneValidation
    private String phone;

    @NotNull(message = "Role must not be null or empty")
    private User.Role role;

    public RegisterRequest() {
    }

    public RegisterRequest(String name, String email, String password, String phone, User.Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "RegisterRequest [name=" + name + ", email=" + email + ", phone=" + phone + ", role=" + role + "]";
    }
}