package com.project.UserAndAttendeeBackend.customvalidation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<PasswordValidation, String> {

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {

        if (password == null || password.isBlank()) {
            return false;
        }

        // min 8 chars, one uppercase, one digit, one special character
        return password.matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]).{8,}$");
    }
}