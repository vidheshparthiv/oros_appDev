package com.oros.app.services;

import com.oros.app.model.Product;
import com.oros.app.model.Vendor;
import com.oros.app.repository.ProductRepository;
import com.oros.app.repository.VendorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;

    public ProductService(ProductRepository productRepository, VendorRepository vendorRepository) {
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product addProduct(Long vendorId, Product product) {
        Optional<Vendor> vendorOptional = vendorRepository.findById(vendorId);
        if (vendorOptional.isEmpty()) {
            return null;
        }
        product.setVendor(vendorOptional.get());
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product product) {
        Optional<Product> existing = productRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }
        product.setId(id);
        return productRepository.save(product);
    }

    public Product deleteProduct(Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) {
            return null;
        }
        productRepository.deleteById(id);
        return product.get();
    }

    public void deleteAllProducts() {
        productRepository.deleteAll();
    }

    public List<Product> getAllProductsSorted(String field) {
        return productRepository.findAll(Sort.by(field));
    }

    public List<Product> getByPages(int page, int size) {
        Page<Product> result = productRepository.findAll(PageRequest.of(page, size));
        return result.getContent();
    }

    public List<Product> getByPagesAndSorted(int page, int size, String field) {
        Page<Product> result = productRepository.findAll(PageRequest.of(page, size, Sort.by(field)));
        return result.getContent();
    }

    public List<Product> getProductsByVendorId(Long vendorId) {
        return productRepository.findByVendorId(vendorId);
    }
}
