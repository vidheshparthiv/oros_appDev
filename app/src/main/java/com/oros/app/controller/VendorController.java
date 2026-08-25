package com.oros.app.controller;

import com.oros.app.model.Vendor;
import com.oros.app.services.VendorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {
    private final VendorService vendorService;
    private final com.oros.app.services.UserService userService;

    public VendorController(VendorService vendorService, com.oros.app.services.UserService userService) {
        this.vendorService = vendorService;
        this.userService = userService;
    }

    //get all vendors
    @GetMapping
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<List<Vendor>>getAll(){
        List<Vendor>vendors=vendorService.getAll();
        return new ResponseEntity<>(vendors,HttpStatus.OK);
    }
    
    //get vendor by Id
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Vendor>getById(@PathVariable Long id) {
        Optional<Vendor> vendor=vendorService.getVendorById(id);
        if (vendor.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(vendor.get(), HttpStatus.OK);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Vendor> getCurrentVendor() {
        // fetch authenticated username from security context
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId;
        try {
            var user = userService.getUserByUsername(username);
            userId = user.getId();
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        var vendorOpt = vendorService.getVendorByUserId(userId);
        if (vendorOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(vendorOpt.get(), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vendor> addVendor(@RequestBody Vendor vendor) {
        if (vendor == null || vendor.getUser() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        var u = vendor.getUser();
        u.setRole(com.oros.app.model.enums.Role.VENDOR);
        if (u.getId() != null) {
            try {
                var existing = userService.getById(u.getId());
                existing.setRole(com.oros.app.model.enums.Role.VENDOR);
                userService.createUser(existing);
                vendor.setUser(existing);
            } catch (Exception ex) {
                var createdUser = userService.createUser(u);
                vendor.setUser(createdUser);
            }
        } else {
            var createdUser = userService.createUser(u);
            vendor.setUser(createdUser);
        }

        Vendor created = vendorService.addVendor(vendor);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/me")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<Vendor> createMyVendor(@RequestBody Vendor vendor) {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        com.oros.app.model.User user;
        try {
            user = userService.getUserByUsername(username);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if (vendor == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        user.setRole(com.oros.app.model.enums.Role.VENDOR);
        userService.createUser(user);

        var existingVendor = vendorService.getVendorByUserId(user.getId());
        if (existingVendor.isPresent()) {
            return new ResponseEntity<>(existingVendor.get(), HttpStatus.OK);
        }

        vendor.setUser(user);

        Vendor created = vendorService.addVendor(vendor);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('VENDOR') || hasRole('ADMIN')")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @RequestBody Vendor vendor) {
        Vendor updated = vendorService.updateVendor(id, vendor);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Vendor> deleteVendor(@PathVariable Long id) {
        Vendor deleted = vendorService.deleteVendor(id);
        if (deleted == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(deleted, HttpStatus.OK);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAll() {
        vendorService.deleteAllVendors();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/sorted/{field}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<List<Vendor>> getAllSorted(@PathVariable String field) {
        return new ResponseEntity<>(vendorService.getAllVendorsSorted(field), HttpStatus.OK);
    }

    @GetMapping("/page/{page}/{size}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<List<Vendor>> getByPages(@PathVariable int page, @PathVariable int size) {
        List<Vendor> vendors = vendorService.getByPages(page, size);
        return new ResponseEntity<>(vendors, HttpStatus.OK);
    }

    @GetMapping("/page/{page}/{size}/{field}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<List<Vendor>> getByPagesAndSorted(@PathVariable int page, @PathVariable int size, @PathVariable String field) {
        List<Vendor> vendors = vendorService.getByPagesAndSorted(page, size, field);
        return new ResponseEntity<>(vendors, HttpStatus.OK);
    }
}
