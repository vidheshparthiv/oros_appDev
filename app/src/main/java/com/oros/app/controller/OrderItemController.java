package com.oros.app.controller;

import com.oros.app.model.OrderItem;
import com.oros.app.services.OrderItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order-items")
@PreAuthorize("hasAnyRole('CUSTOMER','VENDOR','ADMIN')")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @GetMapping
    public ResponseEntity<List<OrderItem>> getAll() {
        return new ResponseEntity<>(orderItemService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getById(@PathVariable Long id) {
        Optional<OrderItem> item = orderItemService.getOrderItemById(id);
        if (item.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(item.get(), HttpStatus.OK);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItem>> getByOrderId(@PathVariable Long orderId) {
        return new ResponseEntity<>(orderItemService.getOrderItemsByOrderId(orderId), HttpStatus.OK);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<OrderItem>> getByProductId(@PathVariable Long productId) {
        return new ResponseEntity<>(orderItemService.getOrderItemsByProductId(productId), HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<OrderItem> addOrderItem(@RequestBody com.oros.app.dto.OrderItemRequest request) {
        OrderItem created = orderItemService.createFromRequest(request);
        if (created == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/{orderId}/{productId}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<OrderItem> addOrderItem(@PathVariable Long orderId, @PathVariable Long productId, @RequestBody OrderItem orderItem) {
        OrderItem created = orderItemService.addOrderItem(orderId, productId, orderItem);
        if (created == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/{orderId}/batch")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<List<OrderItem>> addOrderItemsBatch(@PathVariable Long orderId, @RequestBody List<com.oros.app.dto.OrderItemRequest> requests) {
        List<OrderItem> created = orderItemService.addOrderItemsBatch(orderId, requests);
        if (created == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<OrderItem> updateOrderItem(@PathVariable Long id, @RequestBody OrderItem orderItem) {
        OrderItem updated = orderItemService.updateOrderItem(id, orderItem);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<OrderItem> deleteOrderItem(@PathVariable Long id) {
        OrderItem deleted = orderItemService.deleteOrderItem(id);
        if (deleted == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(deleted, HttpStatus.OK);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAll() {
        orderItemService.deleteAllOrderItems();
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
