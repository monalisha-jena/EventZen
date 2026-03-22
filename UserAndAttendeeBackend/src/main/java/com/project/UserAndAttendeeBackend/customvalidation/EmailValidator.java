package com.project.UserAndAttendeeBackend.customvalidation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EmailValidator implements ConstraintValidator<EmailValidation, String> {

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {

        if (email == null || email.isBlank()) {
            return false;
        }

        return email.matches("^[A-Za-z0-9+_.-]+@(gmail\\.com|yahoo\\.com|outlook\\.com)$");
    }
}