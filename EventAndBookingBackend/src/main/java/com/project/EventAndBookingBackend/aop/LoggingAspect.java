package com.project.EventAndBookingBackend.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    // ── Pointcuts ─────────────────────────────────────
    @Pointcut("execution(* com.project.EventAndBookingBackend.services.EventService.*(..))")
    public void eventServiceMethods() {}

    @Pointcut("execution(* com.project.EventAndBookingBackend.services.RegistrationService.*(..))")
    public void registrationServiceMethods() {}

    // ── Before ────────────────────────────────────────
    @Before("eventServiceMethods() || registrationServiceMethods()")
    public void logBeforeMethod(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("[LOG] Method " + methodName + " is about to execute.");
    }

    // ── After Returning ───────────────────────────────
    @AfterReturning("eventServiceMethods() || registrationServiceMethods()")
    public void logAfterMethod(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("[LOG] Method " + methodName + " executed successfully.");
    }

    // ── Log Arguments ─────────────────────────────────
    @Before("eventServiceMethods() || registrationServiceMethods()")
    public void logMethodArguments(JoinPoint joinPoint) {

        Object[] args = joinPoint.getArgs();

        System.out.print("[LOG] Executing " + joinPoint.getSignature().getName() + " with arguments: [");

        for (int i = 0; i < args.length; i++) {
            System.out.print(args[i]);
            if (i < args.length - 1) {
                System.out.print(", ");
            }
        }

        System.out.println("]");
    }

    // ── After Throwing ────────────────────────────────
    @AfterThrowing(pointcut = "eventServiceMethods() || registrationServiceMethods()", throwing = "exception")
    public void logException(JoinPoint joinPoint, Exception exception) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("[LOG] Method " + methodName + " threw exception: " + exception.getMessage());
    }
}