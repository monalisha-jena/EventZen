package com.project.UserAndAttendeeBackend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // ── Generate Token ────────────────────────────────
    public String generateToken(String email, String role, Long userId, String name) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .claim("userId", String.valueOf(userId))
                .claim("name", name)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // ── Validate Token ────────────────────────────────
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("[JWT] Invalid or expired token: " + e.getMessage());
            return false;
        }
    }

    // ── Extract Email ─────────────────────────────────
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ── Extract Role ──────────────────────────────────
    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    // ── Extract User Id ───────────────────────────────
    public Long extractUserId(String token) {
        return Long.parseLong((String) extractAllClaims(token).get("userId"));
    }

    // ── Extract Name ──────────────────────────────────
    public String extractName(String token) {
        return (String) extractAllClaims(token).get("name");
    }

    // ── Check Expiry ──────────────────────────────────
    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // ── Private Helpers ───────────────────────────────
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
}