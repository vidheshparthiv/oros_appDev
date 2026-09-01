package com.oros.app.controller;

import com.oros.app.model.User;
import com.oros.app.model.Vendor;
import com.oros.app.model.enums.Role;
import com.oros.app.services.UserService;
import com.oros.app.services.VendorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VendorControllerTest {

    @Mock
    private VendorService vendorService;

    @Mock
    private UserService userService;

    @InjectMocks
    private VendorController vendorController;

    @Test
    void createMyVendor_shouldPersistUserRoleAndCreateVendorOnce() {
        User user = new User("alice", "alice@example.com", "secret", Role.CUSTOMER);
        user.setId(5L);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("alice", "secret")
        );

        Vendor request = new Vendor();
        Vendor created = new Vendor();
        created.setId(11L);
        created.setUser(user);

        when(userService.getUserByUsername("alice")).thenReturn(user);
        when(vendorService.getVendorByUserId(5L)).thenReturn(java.util.Optional.empty());
        when(vendorService.addVendor(any(Vendor.class))).thenReturn(created);

        ResponseEntity<Vendor> response = vendorController.createMyVendor(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        verify(userService).createUser(user);
        assertEquals(Role.VENDOR, user.getRole());
    }
}
