package com.project.EventAndBookingBackend.exception;

public class RegistrationNotFoundException extends RuntimeException {

    public RegistrationNotFoundException(String message) {
        super(message);
    }
}