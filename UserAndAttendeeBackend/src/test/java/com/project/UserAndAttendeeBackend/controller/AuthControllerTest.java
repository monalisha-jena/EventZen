package com.project.UserAndAttendeeBackend.controller;

import com.project.UserAndAttendeeBackend.dto.response.AuthResponse;
import com.project.UserAndAttendeeBackend.dto.response.UserResponse;
import com.project.UserAndAttendeeBackend.models.User;
import com.project.UserAndAttendeeBackend.service.AuthService;
import com.project.UserAndAttendeeBackend.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    AuthResponse authResponse;

    @BeforeEach
    public void setup() {
        authResponse = new AuthResponse(
            "mock.jwt.token",
            "CUSTOMER",
            "User registered successfully",
            1L,
            "Monalisha Jena"
        );
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    public void testRegisterUser() throws Exception {
        when(authService.registerUser(Mockito.any())).thenReturn(authResponse);
        mockMvc.perform(post("/auth/register")
                .contentType("application/json")
                .content("{\"name\":\"Monalisha Jena\",\"email\":\"monalisha@gmail.com\",\"phone\":\"9876543210\",\"password\":\"Password@123\",\"role\":\"CUSTOMER\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testRegisterAdmin() throws Exception {
        when(authService.registerAdmin(Mockito.any(), Mockito.any())).thenReturn(authResponse);
        mockMvc.perform(post("/auth/register/admin")
                .contentType("application/json")
                .header("Admin-Secret", "EventZenAdminSecret@2024")
                .content("{\"name\":\"Admin User\",\"email\":\"admin@gmail.com\",\"phone\":\"9876543212\",\"password\":\"Password@123\",\"role\":\"ADMIN\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testLoginUser() throws Exception {
        when(authService.loginUser(Mockito.any())).thenReturn(authResponse);
        mockMvc.perform(post("/auth/login")
                .contentType("application/json")
                .content("{\"email\":\"monalisha@gmail.com\",\"password\":\"Password@123\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testLogoutUser() throws Exception {
        mockMvc.perform(post("/auth/logout")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }
}