package com.project.EventAndBookingBackend.customvalidation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDateTime;

public class FutureDateValidator implements ConstraintValidator<FutureDateValidation, LocalDateTime> {

    @Override
    public boolean isValid(LocalDateTime date, ConstraintValidatorContext context) {

        if (date == null) {
            return false;
        }

        return date.isAfter(LocalDateTime.now());
    }
}