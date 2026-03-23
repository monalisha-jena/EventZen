package com.project.UserAndAttendeeBackend.service;

import com.project.UserAndAttendeeBackend.dto.request.LoginRequest;
import com.project.UserAndAttendeeBackend.dto.request.RegisterRequest;
import com.project.UserAndAttendeeBackend.dto.response.AuthResponse;
import com.project.UserAndAttendeeBackend.exception.UserAlreadyExistsException;
import com.project.UserAndAttendeeBackend.exception.UserNotFoundException;
import com.project.UserAndAttendeeBackend.exception.UnauthorizedException;
import com.project.UserAndAttendeeBackend.models.User;
import com.project.UserAndAttendeeBackend.repository.UserRepository;
import com.project.UserAndAttendeeBackend.util.JwtUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    RegisterRequest registerRequest;
    LoginRequest loginRequest;
    User user;

    @BeforeEach
    public void setup() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Monalisha Jena");
        registerRequest.setEmail("monalisha@gmail.com");
        registerRequest.setPhone("9876543210");
        registerRequest.setPassword("Password@123");
        registerRequest.setRole(User.Role.CUSTOMER);

        loginRequest = new LoginRequest();
        loginRequest.setEmail("monalisha@gmail.com");
        loginRequest.setPassword("Password@123");

        user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("encodedPassword");
        user.setRole(User.Role.CUSTOMER);

        ReflectionTestUtils.setField(authService, "adminSecretKey", "EventZenAdminSecret@2024");
    }

    @Test
    public void testRegisterUser_Success() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.existsByPhone(registerRequest.getPhone())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(Mockito.any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any())).thenReturn("mock.jwt.token");

        AuthResponse response = authService.registerUser(registerRequest);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("CUSTOMER", response.getRole());
    }

    @Test
    public void testRegisterUser_AdminNotAllowed() {
        registerRequest.setRole(User.Role.ADMIN);

        assertThrows(UnauthorizedException.class, () -> {
            authService.registerUser(registerRequest);
        });
    }

    @Test
    public void testRegisterUser_EmailAlreadyExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> {
            authService.registerUser(registerRequest);
        });
    }

    @Test
    public void testRegisterUser_PhoneAlreadyExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.existsByPhone(registerRequest.getPhone())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> {
            authService.registerUser(registerRequest);
        });
    }

    @Test
    public void testLoginUser_Success() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any())).thenReturn("mock.jwt.token");

        AuthResponse response = authService.loginUser(loginRequest);

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
        assertEquals("Login successful", response.getMessage());
    }

    @Test
    public void testLoginUser_UserNotFound() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            authService.loginUser(loginRequest);
        });
    }

    @Test
    public void testLoginUser_WrongPassword() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())).thenReturn(false);

        assertThrows(UserNotFoundException.class, () -> {
            authService.loginUser(loginRequest);
        });
    }

    @Test
    public void testRegisterAdmin_Success() {
        registerRequest.setRole(User.Role.ADMIN);
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(userRepository.existsByPhone(registerRequest.getPhone())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(Mockito.any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken(Mockito.any(), Mockito.any(), Mockito.any(), Mockito.any())).thenReturn("mock.jwt.token");

        AuthResponse response = authService.registerAdmin(registerRequest, "EventZenAdminSecret@2024");

        assertNotNull(response);
        assertEquals("mock.jwt.token", response.getToken());
    }

    @Test
    public void testRegisterAdmin_WrongSecret() {
        assertThrows(UnauthorizedException.class, () -> {
            authService.registerAdmin(registerRequest, "wrongsecret");
        });
    }
}