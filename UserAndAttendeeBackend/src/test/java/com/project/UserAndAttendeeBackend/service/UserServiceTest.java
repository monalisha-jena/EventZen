package com.project.UserAndAttendeeBackend.service;

import com.project.UserAndAttendeeBackend.dto.request.UpdateUserRequest;
import com.project.UserAndAttendeeBackend.dto.response.UserResponse;
import com.project.UserAndAttendeeBackend.exception.UserNotFoundException;
import com.project.UserAndAttendeeBackend.models.User;
import com.project.UserAndAttendeeBackend.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    User user;
    UpdateUserRequest updateRequest;

    @BeforeEach
    public void setup() {
        user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);

        updateRequest = new UpdateUserRequest();
        updateRequest.setName("Monalisha Updated");
        updateRequest.setPhone("9999999999");
    }

    @Test
    public void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserResponse response = userService.getUserById(1L);

        assertNotNull(response);
        assertEquals("Monalisha Jena", response.getName());
        assertEquals("monalisha@gmail.com", response.getEmail());
    }

    @Test
    public void testGetUserById_NotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            userService.getUserById(99L);
        });
    }

    @Test
    public void testUpdateUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);

        UserResponse response = userService.updateUser(1L, updateRequest);

        assertNotNull(response);
        assertEquals("Monalisha Updated", response.getName());
        assertEquals("9999999999", response.getPhone());
    }

    @Test
    public void testUpdateUser_NotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            userService.updateUser(99L, updateRequest);
        });
    }

    @Test
    public void testDeleteUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        boolean result = userService.deleteUser(1L);

        assertTrue(result);
        Mockito.verify(userRepository).delete(user);
    }

    @Test
    public void testDeleteUser_NotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> {
            userService.deleteUser(99L);
        });
    }
}