package com.oros.app.controller;

import com.oros.app.model.User;
import com.oros.app.model.enums.Role;
import com.oros.app.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Test
    void createUser_shouldReturnCreatedStatus() {
        User request = new User("alice", "alice@example.com", "secret", Role.CUSTOMER);
        User saved = new User("alice", "alice@example.com", "secret", Role.CUSTOMER);
        saved.setId(10L);

        when(userService.createUser(any(User.class))).thenReturn(saved);

        ResponseEntity<User> response = userController.createUser(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(10L, response.getBody().getId());
    }
}
