package com.oros.app.services;

import com.oros.app.model.Order;
import com.oros.app.model.OrderItem;
import com.oros.app.model.Product;
import com.oros.app.model.enums.OrderStatus;
import com.oros.app.repository.OrderRepository;
import com.oros.app.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order addOrder(Order order) {
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(LocalDateTime.now());
        }
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.PENDING);
        }
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order order) {
        Optional<Order> existing = orderRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }
        order.setId(id);
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(existing.get().getCreatedAt());
        }
        if (order.getStatus() == null) {
            order.setStatus(existing.get().getStatus());
        }
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, OrderStatus status) {
        Optional<Order> existing = orderRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }
        Order order = existing.get();

        // If confirming order, decrement product stock counts
        if (status == OrderStatus.CONFIRMED) {
            java.math.BigDecimal total = java.math.BigDecimal.ZERO;
            for (OrderItem it : order.getItems()) {
                Product p = it.getProduct();
                int qty = it.getQuantity() == null ? 1 : it.getQuantity();
                if (p == null) continue;
                Integer stock = p.getStock() == null ? 0 : p.getStock();
                if (stock < qty) {
                    // insufficient stock, cannot confirm
                    throw new IllegalStateException("INSUFFICIENT_STOCK");
                }
                p.setStock(stock - qty);
                productRepository.save(p);
                if (it.getTotalPrice() != null) total = total.add(it.getTotalPrice());
            }
            order.setTotalPrice(total);
        }

        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order deleteOrder(Long id) {
        Optional<Order> order = orderRepository.findById(id);
        if (order.isEmpty()) {
            return null;
        }
        orderRepository.deleteById(id);
        return order.get();
    }

    public void deleteAllOrders() {
        orderRepository.deleteAll();
    }

    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getOrdersForVendor(Long vendorId) {
        return orderRepository.findByItems_Product_Vendor_Id(vendorId);
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
}
