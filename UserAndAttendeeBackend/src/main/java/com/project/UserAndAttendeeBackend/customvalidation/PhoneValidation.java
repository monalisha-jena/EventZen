package com.project.UserAndAttendeeBackend.customvalidation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PhoneValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface PhoneValidation {

    String message() default "Phone must be a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}