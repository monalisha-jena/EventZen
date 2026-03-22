package com.project.UserAndAttendeeBackend.customvalidation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneValidator implements ConstraintValidator<PhoneValidation, String> {

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext context) {

        if (phone == null || phone.isBlank()) {
            return false;
        }

        // exactly 10 digits, starts with 6, 7, 8 or 9 (Indian mobile numbers)
        return phone.matches("^[6-9][0-9]{9}$");
    }
}