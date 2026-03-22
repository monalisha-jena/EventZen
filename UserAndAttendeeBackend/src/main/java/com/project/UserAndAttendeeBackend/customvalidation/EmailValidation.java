package com.project.UserAndAttendeeBackend.customvalidation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = EmailValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface EmailValidation {

    String message() default "Email should be valid and end with @gmail.com, @yahoo.com or @outlook.com";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}