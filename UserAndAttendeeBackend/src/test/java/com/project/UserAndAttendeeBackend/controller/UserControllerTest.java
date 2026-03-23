package com.project.UserAndAttendeeBackend.controller;

import com.project.UserAndAttendeeBackend.dto.response.UserResponse;
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
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    UserResponse userResponse;

    @BeforeEach
    public void setup() {
        userResponse = new UserResponse(
            1L,
            "Monalisha Jena",
            "monalisha@gmail.com",
            "9876543210",
            "CUSTOMER",
            null
        );
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void testGetUserById() throws Exception {
        when(userService.getUserById(1L)).thenReturn(userResponse);
        mockMvc.perform(get("/users/1")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }

    @Test
    public void testUpdateUser() throws Exception {
        when(userService.updateUser(Mockito.anyLong(), Mockito.any())).thenReturn(userResponse);
        mockMvc.perform(put("/users/update/1")
                .contentType("application/json")
                .content("{\"name\":\"Monalisha Updated\",\"phone\":\"9999999999\"}"))
                .andExpect(status().isOk());
    }

    @Test
    public void testDeleteUser() throws Exception {
        when(userService.deleteUser(1L)).thenReturn(true);
        mockMvc.perform(delete("/users/delete/1")
                .contentType("application/json"))
                .andExpect(status().isOk());
    }
}
