package com.mobilemart.service;

import com.mobilemart.model.Order;
import com.mobilemart.model.Product;
import com.mobilemart.model.User;
import com.mobilemart.repository.OrderRepository;
import com.mobilemart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Order createOrder(User customer, Long productId, String customerName, String phone, String email, BigDecimal salePrice, String paymentMethod) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Order order = new Order();
        order.setOrderNumber("INV-" + System.currentTimeMillis());
        order.setUser(customer);
        order.setProduct(product);
        order.setCustomerName(customerName);
        order.setCustomerPhone(phone);
        order.setCustomerEmail(email);
        order.setSalePrice(salePrice != null ? salePrice : product.getSellingPrice());
        order.setPaymentMethod(paymentMethod != null ? paymentMethod : "CASH");
        order.setStatus("COMPLETED");

        if (Boolean.TRUE.equals(product.getWarrantyAvailable())) {
            order.setWarrantyStartDate(LocalDate.now());
            int months = product.getWarrantyMonths() != null ? product.getWarrantyMonths() : 3;
            order.setWarrantyEndDate(LocalDate.now().plusMonths(months));
        }

        // Mark product as SOLD
        product.setStatus("SOLD");
        productRepository.save(product);

        Order savedOrder = orderRepository.save(order);

        if (customer != null) {
            notificationService.createNotification(
                    customer,
                    "Order Invoice Generated (" + savedOrder.getOrderNumber() + ")",
                    "Thank you for purchasing " + product.getBrand() + " " + product.getModelName() + "! Invoice total: ₹" + savedOrder.getSalePrice(),
                    "ORDER",
                    "/orders"
            );
        }

        return savedOrder;
    }

    public List<Order> getCustomerOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
}
