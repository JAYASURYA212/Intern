package com.mobilemart.controller;

import com.mobilemart.model.Order;
import com.mobilemart.model.User;
import com.mobilemart.service.AuthService;
import com.mobilemart.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthService authService;

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getCustomerOrders(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(orderService.getCustomerOrders(user));
    }

    @GetMapping("/owner/orders")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PostMapping("/owner/orders")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> payload) {
        Long productId = Long.parseLong(payload.get("productId").toString());
        String name = (String) payload.get("customerName");
        String phone = (String) payload.get("customerPhone");
        String email = (String) payload.get("customerEmail");
        BigDecimal price = payload.get("salePrice") != null ? new BigDecimal(payload.get("salePrice").toString()) : null;
        String payment = (String) payload.get("paymentMethod");

        User customer = null;
        if (email != null && !email.trim().isEmpty()) {
            try {
                customer = authService.getCurrentUser(email);
            } catch (Exception ignored) {}
        }

        return ResponseEntity.ok(orderService.createOrder(customer, productId, name, phone, email, price, payment));
    }
}
