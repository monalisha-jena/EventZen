package com.project.UserAndAttendeeBackend.aop;

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

    @Pointcut("execution(* com.project.UserAndAttendeeBackend.services.UserService.*(..))")
    public void userServiceMethods() {}

    @Pointcut("execution(* com.project.UserAndAttendeeBackend.services.AuthService.*(..))")
    public void authServiceMethods() {}

    // ── Before ────────────────────────────────────────

    @Before("userServiceMethods() || authServiceMethods()")
    public void logBeforeMethod(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("[LOG] Method " + methodName + " is about to execute.");
    }

    // ── After Returning ───────────────────────────────

    @AfterReturning("userServiceMethods() || authServiceMethods()")
    public void logAfterMethod(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("[LOG] Method " + methodName + " executed successfully.");
    }

    // ── Log Arguments ─────────────────────────────────

    @Before("userServiceMethods() || authServiceMethods()")
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

    @AfterThrowing(pointcut = "userServiceMethods() || authServiceMethods()", throwing = "exception")
    public void logException(JoinPoint joinPoint, Exception exception) {
        String methodName = joinPoint.getSignature().getName();
        System.out.println("[LOG] Method " + methodName + " threw exception: " + exception.getMessage());
    }
}
