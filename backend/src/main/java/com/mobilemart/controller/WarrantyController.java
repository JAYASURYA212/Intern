package com.mobilemart.controller;

import com.mobilemart.model.User;
import com.mobilemart.model.WarrantyClaim;
import com.mobilemart.service.AuthService;
import com.mobilemart.service.WarrantyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class WarrantyController {

    @Autowired
    private WarrantyService warrantyService;

    @Autowired
    private AuthService authService;

    @PostMapping("/warranty/claims")
    public ResponseEntity<WarrantyClaim> submitClaim(Authentication authentication, @RequestBody Map<String, Object> payload) {
        User user = authService.getCurrentUser(authentication.getName());
        Long productId = Long.parseLong(payload.get("productId").toString());
        Long orderId = payload.get("orderId") != null ? Long.parseLong(payload.get("orderId").toString()) : null;
        String issueTitle = (String) payload.get("issueTitle");
        String description = (String) payload.get("description");
        String imageUrl = (String) payload.get("imageUrl");

        return ResponseEntity.ok(warrantyService.submitClaim(user, productId, orderId, issueTitle, description, imageUrl));
    }

    @GetMapping("/warranty/claims")
    public ResponseEntity<List<WarrantyClaim>> getCustomerClaims(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(warrantyService.getCustomerClaims(user));
    }

    @GetMapping("/owner/warranty/claims")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<List<WarrantyClaim>> getAllClaims() {
        return ResponseEntity.ok(warrantyService.getAllClaims());
    }

    @PutMapping("/owner/warranty/claims/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<WarrantyClaim> updateClaimStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String adminNotes = payload.get("adminNotes");
        return ResponseEntity.ok(warrantyService.updateStatus(id, status, adminNotes));
    }
}
