package com.project.UserAndAttendeeBackend.dto.request;

import com.project.UserAndAttendeeBackend.customvalidation.PhoneValidation;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateUserRequest {

    @NotNull(message = "Name must not be null or empty")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String name;

    @PhoneValidation
    private String phone;

    public UpdateUserRequest() {
    }

    public UpdateUserRequest(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @Override
    public String toString() {
        return "UpdateUserRequest [name=" + name + ", phone=" + phone + "]";
    }
}