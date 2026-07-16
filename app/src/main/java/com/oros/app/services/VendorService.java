package com.oros.app.services;

import com.oros.app.model.Vendor;
import com.oros.app.repository.VendorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VendorService {
    private final VendorRepository vendorRepository;

    public VendorService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public List<Vendor> getAll() {
        return vendorRepository.findAll();
    }

    public Optional<Vendor> getVendorById(Long id) {
        return vendorRepository.findById(id);
    }

    public Vendor addVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    public Vendor updateVendor(Long id, Vendor vendor) {
        Optional<Vendor> existing = vendorRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }
        vendor.setId(id);
        return vendorRepository.save(vendor);
    }

    public Vendor deleteVendor(Long id) {
        Optional<Vendor> vendor = vendorRepository.findById(id);
        if (vendor.isEmpty()) {
            return null;
        }
        vendorRepository.deleteById(id);
        return vendor.get();
    }

    public void deleteAllVendors() {
        vendorRepository.deleteAll();
    }

    public List<Vendor> getAllVendorsSorted(String field) {
        return vendorRepository.findAll(Sort.by(field));
    }

    public List<Vendor> getByPages(int page, int size) {
        Page<Vendor> result = vendorRepository.findAll(PageRequest.of(page, size));
        return result.getContent();
    }

    public List<Vendor> getByPagesAndSorted(int page, int size, String field) {
        Page<Vendor> result = vendorRepository.findAll(PageRequest.of(page, size, Sort.by(field)));
        return result.getContent();
    }
}
