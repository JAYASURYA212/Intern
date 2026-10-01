package com.mobilemart.service;

import com.mobilemart.model.Order;
import com.mobilemart.model.Product;
import com.mobilemart.model.User;
import com.mobilemart.model.WarrantyClaim;
import com.mobilemart.repository.OrderRepository;
import com.mobilemart.repository.ProductRepository;
import com.mobilemart.repository.WarrantyClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarrantyService {

    @Autowired
    private WarrantyClaimRepository warrantyClaimRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private NotificationService notificationService;

    public WarrantyClaim submitClaim(User user, Long productId, Long orderId, String issueTitle, String description, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Order order = null;
        if (orderId != null) {
            order = orderRepository.findById(orderId).orElse(null);
        }

        WarrantyClaim claim = new WarrantyClaim();
        claim.setUser(user);
        claim.setProduct(product);
        claim.setOrder(order);
        claim.setIssueTitle(issueTitle);
        claim.setDescription(description);
        claim.setImageUrl(imageUrl);
        claim.setStatus("SUBMITTED");

        WarrantyClaim saved = warrantyClaimRepository.save(claim);

        notificationService.createNotification(
                user,
                "Warranty Claim Submitted: " + issueTitle,
                "Your warranty claim for " + product.getBrand() + " " + product.getModelName() + " has been registered and is under review.",
                "WARRANTY",
                "/warranty-claims"
        );

        return saved;
    }

    public List<WarrantyClaim> getCustomerClaims(User user) {
        return warrantyClaimRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<WarrantyClaim> getAllClaims() {
        return warrantyClaimRepository.findAllByOrderByCreatedAtDesc();
    }

    public WarrantyClaim updateStatus(Long id, String status, String adminNotes) {
        WarrantyClaim claim = warrantyClaimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warranty claim not found"));

        claim.setStatus(status);
        if (adminNotes != null) claim.setAdminNotes(adminNotes);

        WarrantyClaim saved = warrantyClaimRepository.save(claim);

        notificationService.createNotification(
                claim.getUser(),
                "Warranty Claim Status: " + status,
                "Claim update for " + claim.getProduct().getModelName() + ": " + (adminNotes != null ? adminNotes : status),
                "WARRANTY",
                "/warranty-claims"
        );

        return saved;
    }
}
