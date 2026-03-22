package com.project.UserAndAttendeeBackend.customvalidation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = PasswordValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordValidation {

    String message() default "Password must be at least 8 characters, contain one uppercase, one digit and one special character";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}