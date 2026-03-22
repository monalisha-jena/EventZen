package com.project.EventAndBookingBackend.exception;

public class AlreadyRegisteredException extends RuntimeException {

    public AlreadyRegisteredException(String message) {
        super(message);
    }
}