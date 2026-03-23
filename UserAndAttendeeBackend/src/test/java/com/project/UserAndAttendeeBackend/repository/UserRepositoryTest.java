package com.project.UserAndAttendeeBackend.repository;

import com.project.UserAndAttendeeBackend.models.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

// JUnit5 Testing (Integration Testing)
@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        System.out.println("Before each test");
    }

    @AfterEach
    public void tearDown() {
        System.out.println("After each test");
    }

    @Test
    public void testSaveUser() {
        User user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);

        User savedUser = userRepository.save(user);

        assertNotNull(savedUser);
        assertEquals("Monalisha Jena", savedUser.getName());
        assertEquals("monalisha@gmail.com", savedUser.getEmail());
        assertEquals(User.Role.CUSTOMER, savedUser.getRole());
    }

    @Test
    public void testFindAllUsers() {
        User user1 = new User();
        user1.setName("Monalisha Jena");
        user1.setEmail("monalisha@gmail.com");
        user1.setPhone("9876543210");
        user1.setPassword("Password@123");
        user1.setRole(User.Role.CUSTOMER);
        userRepository.save(user1);

        User user2 = new User();
        user2.setName("Nirvan Jain");
        user2.setEmail("nirvan@gmail.com");
        user2.setPhone("9876543211");
        user2.setPassword("Password@123");
        user2.setRole(User.Role.ATTENDEE);
        userRepository.save(user2);

        List<User> users = userRepository.findAll();
        assertEquals(2, users.size());
        assertEquals("Monalisha Jena", users.get(0).getName());
        assertEquals("monalisha@gmail.com", users.get(0).getEmail());
        assertEquals("Nirvan Jain", users.get(1).getName());
        assertEquals("nirvan@gmail.com", users.get(1).getEmail());
    }

    @Test
    @DisplayName("Test deleteById method of UserRepository")
    public void testDeleteById() {
        User user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);
        User savedUser = userRepository.save(user);

        userRepository.deleteById(savedUser.getId());
        assertEquals(0, userRepository.count());
        assertNull(userRepository.findById(savedUser.getId()).orElse(null));
    }

    @Test
    public void testUpdateUser() {
        User user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);
        User savedUser = userRepository.save(user);

        savedUser.setName("Monalisha Updated");
        savedUser.setPhone("9999999999");
        User updatedUser = userRepository.save(savedUser);

        assertEquals("Monalisha Updated", updatedUser.getName());
        assertEquals("9999999999", updatedUser.getPhone());
    }

    @Test
    public void testFindById() {
        User user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);
        User savedUser = userRepository.save(user);

        User foundUser = userRepository.findById(savedUser.getId()).orElse(null);
        assertNotNull(foundUser);
        assertEquals("Monalisha Jena", foundUser.getName());
        assertEquals("monalisha@gmail.com", foundUser.getEmail());
    }

    @Test
    public void testFindByEmail() {
        User user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);

        User foundUser = userRepository.findByEmail("monalisha@gmail.com").orElse(null);
        assertNotNull(foundUser);
        assertEquals("Monalisha Jena", foundUser.getName());
    }

    @Test
    public void testExistsByEmail() {
        User user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);

        assertTrue(userRepository.existsByEmail("monalisha@gmail.com"));
        assertFalse(userRepository.existsByEmail("notexist@gmail.com"));
    }

    @Test
    public void testExistsByPhone() {
        User user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);
        userRepository.save(user);

        assertTrue(userRepository.existsByPhone("9876543210"));
        assertFalse(userRepository.existsByPhone("0000000000"));
    }

    @Test
    public void checkAssertAll() {
        User user = new User();
        user.setName("Monalisha Jena");
        user.setEmail("monalisha@gmail.com");
        user.setPhone("9876543210");
        user.setPassword("Password@123");
        user.setRole(User.Role.CUSTOMER);
        User savedUser = userRepository.save(user);

        assertAll("Checking all user fields",
            () -> assertNotNull(savedUser),
            () -> assertEquals("Monalisha Jena", savedUser.getName()),
            () -> assertEquals("monalisha@gmail.com", savedUser.getEmail()),
            () -> assertEquals(User.Role.CUSTOMER, savedUser.getRole())
        );
    }
}