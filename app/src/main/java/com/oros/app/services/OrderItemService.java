package com.oros.app.services;

import com.oros.app.model.Order;
import com.oros.app.model.OrderItem;
import com.oros.app.model.Product;
import com.oros.app.repository.OrderItemRepository;
import com.oros.app.repository.OrderRepository;
import com.oros.app.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderItemService(OrderItemRepository orderItemRepository, OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public List<OrderItem> getAll() {
        return orderItemRepository.findAll();
    }

    public Optional<OrderItem> getOrderItemById(Long id) {
        return orderItemRepository.findById(id);
    }

    public List<OrderItem> getOrderItemsByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public List<OrderItem> getOrderItemsByProductId(Long productId) {
        return orderItemRepository.findByProductId(productId);
    }

    public OrderItem addOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public OrderItem addOrderItem(Long orderId, Long productId, OrderItem orderItem) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        Optional<Product> productOpt = productRepository.findById(productId);

        if (orderOpt.isEmpty() || productOpt.isEmpty()) {
            return null;
        }

        Order order = orderOpt.get();
        Product product = productOpt.get();

        orderItem.setOrder(order);
        orderItem.setProduct(product);

        if (orderItem.getQuantity() == null) {
            orderItem.setQuantity(1);
        }

        if (product.getPrice() == null) {
            return null;
        }

        BigDecimal unitPrice = product.getPrice();
        orderItem.setUnitPrice(unitPrice);
        orderItem.setTotalPrice(unitPrice.multiply(BigDecimal.valueOf(orderItem.getQuantity())));

        OrderItem saved = orderItemRepository.save(orderItem);

        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);
        java.math.BigDecimal total = java.math.BigDecimal.ZERO;
        for (OrderItem it : items) {
            if (it.getTotalPrice() != null) {
                total = total.add(it.getTotalPrice());
            }
        }
        order.setTotalPrice(total);
        orderRepository.save(order);

        return saved;
    }

    public OrderItem createFromRequest(com.oros.app.dto.OrderItemRequest request) {
        if (request == null || request.getProductId() == null || request.getOrderId() == null) {
            return null;
        }

        OrderItem item = new OrderItem();
        item.setQuantity(request.getQuantity() == null ? 1 : request.getQuantity());
        return addOrderItem(request.getOrderId(), request.getProductId(), item);
    }

    public List<OrderItem> addOrderItemsBatch(Long orderId, List<com.oros.app.dto.OrderItemRequest> requests) {
        java.util.List<OrderItem> created = new java.util.ArrayList<>();
        for (com.oros.app.dto.OrderItemRequest req : requests) {
            OrderItem item = new OrderItem();
            item.setQuantity(req.getQuantity() == null ? 1 : req.getQuantity());
            OrderItem saved = addOrderItem(orderId, req.getProductId(), item);
            if (saved == null) {
                return null;
            }
            created.add(saved);
        }
        return created;
    }

    public OrderItem updateOrderItem(Long id, OrderItem orderItem) {
        Optional<OrderItem> existing = orderItemRepository.findById(id);
        if (existing.isEmpty()) {
            return null;
        }
        orderItem.setId(id);
        return orderItemRepository.save(orderItem);
    }

    public OrderItem deleteOrderItem(Long id) {
        Optional<OrderItem> item = orderItemRepository.findById(id);
        if (item.isEmpty()) {
            return null;
        }
        orderItemRepository.deleteById(id);
        return item.get();
    }

    public void deleteAllOrderItems() {
        orderItemRepository.deleteAll();
    }

    public boolean attachItemsToOrder(Long orderId, java.util.List<Long> itemIds) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) return false;
        Order order = orderOpt.get();

        Iterable<OrderItem> items = orderItemRepository.findAllById(itemIds);
        java.math.BigDecimal total = java.math.BigDecimal.ZERO;
        java.util.List<OrderItem> toSave = new java.util.ArrayList<>();
        for (OrderItem it : items) {
            it.setOrder(order);
            // ensure prices are set from product
            Product p = it.getProduct();
            if (p != null && p.getPrice() != null) {
                it.setUnitPrice(p.getPrice());
                it.setTotalPrice(p.getPrice().multiply(java.math.BigDecimal.valueOf(it.getQuantity() == null ? 1 : it.getQuantity())));
            }
            if (it.getTotalPrice() != null) total = total.add(it.getTotalPrice());
            toSave.add(it);
        }
        orderItemRepository.saveAll(toSave);
        order.setTotalPrice(total);
        orderRepository.save(order);
        return true;
    }
}
