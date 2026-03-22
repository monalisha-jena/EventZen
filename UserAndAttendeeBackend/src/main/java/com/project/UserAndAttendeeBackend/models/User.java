package com.project.UserAndAttendeeBackend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Email;

import java.time.LocalDateTime;

import com.project.UserAndAttendeeBackend.customvalidation.EmailValidation;
import com.project.UserAndAttendeeBackend.customvalidation.PasswordValidation;
import com.project.UserAndAttendeeBackend.customvalidation.PhoneValidation;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Name must not be null or empty")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Email must not be null or empty")
    @EmailValidation
    @Column(nullable = false, unique = true)
    private String email;

    @NotNull(message = "Phone must not be null or empty")
    @PhoneValidation
    @Column(nullable = false, unique = true)
    private String phone;

    @NotNull(message = "Password must not be null or empty")
    @PasswordValidation
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Enum
    public enum Role {
        ADMIN,
        CUSTOMER,
        ATTENDEE
    }

    
    public User() {
    }

    public User(Long id, String name, String email, String phone, String password, Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }

    // Lifecycle hooks 
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhone() { 
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", name=" + name + ", email=" + email + ", phone=" + phone
                + ", role=" + role + ", createdAt=" + createdAt + "]";
    }
}
