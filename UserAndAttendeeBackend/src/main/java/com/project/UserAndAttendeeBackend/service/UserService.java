package com.project.UserAndAttendeeBackend.service;


import com.project.UserAndAttendeeBackend.dto.request.UpdateUserRequest;
import com.project.UserAndAttendeeBackend.dto.response.UserResponse;
import com.project.UserAndAttendeeBackend.exception.UserNotFoundException;
import com.project.UserAndAttendeeBackend.models.User;
import com.project.UserAndAttendeeBackend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID " + id));

        return mapToUserResponse(user);
    }

    public UserResponse updateUser(Long id, UpdateUserRequest request) {

        User existing = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID " + id));

        existing.setName(request.getName());
        existing.setPhone(request.getPhone());
        userRepository.save(existing);

        return mapToUserResponse(existing);
    }

    public boolean deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID " + id));

        userRepository.delete(user);
        return true;
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
