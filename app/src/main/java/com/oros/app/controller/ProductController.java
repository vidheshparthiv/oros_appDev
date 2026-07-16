package com.oros.app.controller;

import com.oros.app.model.Product;
import com.oros.app.services.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        List<Product> products = productService.getAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(product.get(), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product created = productService.addProduct(product);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product updated = productService.updateProduct(id, product);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Product> deleteProduct(@PathVariable Long id) {
        Product deleted = productService.deleteProduct(id);
        if (deleted == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(deleted, HttpStatus.OK);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAll() {
        productService.deleteAllProducts();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/sorted/{field}")
    public ResponseEntity<List<Product>> getAllSorted(@PathVariable String field) {
        return new ResponseEntity<>(productService.getAllProductsSorted(field), HttpStatus.OK);
    }

    @GetMapping("/page/{page}/{size}")
    public ResponseEntity<List<Product>> getByPages(@PathVariable int page, @PathVariable int size) {
        List<Product> products = productService.getByPages(page, size);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/page/{page}/{size}/{field}")
    public ResponseEntity<List<Product>> getByPagesAndSorted(@PathVariable int page, @PathVariable int size, @PathVariable String field) {
        List<Product> products = productService.getByPagesAndSorted(page, size, field);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<Product>> getByVendorId(@PathVariable Long vendorId) {
        List<Product> products = productService.getProductsByVendorId(vendorId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
