package com.oros.app.services;

import com.oros.app.model.Order;
import com.oros.app.model.enums.OrderStatus;
import com.oros.app.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
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

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
}
