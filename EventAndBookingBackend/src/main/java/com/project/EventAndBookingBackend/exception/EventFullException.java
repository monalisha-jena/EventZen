package com.project.EventAndBookingBackend.exception;

public class EventFullException extends RuntimeException {

    public EventFullException(String message) {
        super(message);
    }
}