package com.oros.app.controller;

import com.oros.app.model.Product;
import com.oros.app.services.ProductService;
import com.oros.app.services.VendorService;
import com.oros.app.services.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
    private final VendorService vendorService;
    private final UserService userService;

    public ProductController(ProductService productService, VendorService vendorService, UserService userService) {
        this.productService = productService;
        this.vendorService = vendorService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_VENDOR"))) {
            String username = auth.getName();
            try {
                var user = userService.getUserByUsername(username);
                var vendorOpt = vendorService.getVendorByUserId(user.getId());
                if (vendorOpt.isPresent()) {
                    List<Product> products = productService.getProductsByVendorId(vendorOpt.get().getId());
                    return new ResponseEntity<>(products, HttpStatus.OK);
                }
                return new ResponseEntity<>(List.of(), HttpStatus.OK);
            } catch (Exception ex) {
                return new ResponseEntity<>(List.of(), HttpStatus.OK);
            }
        }
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

    @PostMapping("/{vendorId}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Product> addProduct(@PathVariable Long vendorId, @RequestBody Product product) {
        Product created = productService.addProduct(vendorId, product);
        if (created == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchByName(@RequestParam(required = false) String q) {
        List<Product> products = productService.searchByName(q);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
}
