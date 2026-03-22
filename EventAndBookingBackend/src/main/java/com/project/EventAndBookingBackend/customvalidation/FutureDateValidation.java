package com.project.EventAndBookingBackend.customvalidation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = FutureDateValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface FutureDateValidation {

    String message() default "Event date must be a future date";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}