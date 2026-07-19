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

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
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

    @PostMapping
    public ResponseEntity<Vendor> addVendor(@RequestBody Vendor vendor) {
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
