package com.mobilemart.controller;

import com.mobilemart.dto.SellRequestDTOs.*;
import com.mobilemart.model.Product;
import com.mobilemart.model.SellRequest;
import com.mobilemart.model.User;
import com.mobilemart.service.AuthService;
import com.mobilemart.service.SellRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SellRequestController {

    @Autowired
    private SellRequestService sellRequestService;

    @Autowired
    private AuthService authService;

    // Customer Endpoints
    @PostMapping("/sell-requests")
    public ResponseEntity<SellRequest> submitSellRequest(Authentication authentication, @RequestBody SellRequestInput input) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(sellRequestService.createSellRequest(user, input));
    }

    @GetMapping("/sell-requests")
    public ResponseEntity<List<SellRequest>> getCustomerSellRequests(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(sellRequestService.getCustomerSellRequests(user));
    }

    @GetMapping("/sell-requests/{id}")
    public ResponseEntity<SellRequest> getSellRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(sellRequestService.getSellRequestById(id));
    }

    @PutMapping("/sell-requests/{id}/offer-response")
    public ResponseEntity<SellRequest> respondToOffer(Authentication authentication, @PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        User user = authService.getCurrentUser(authentication.getName());
        boolean accept = payload.getOrDefault("accept", false);
        return ResponseEntity.ok(sellRequestService.respondToOffer(id, user, accept));
    }

    // Owner Endpoints
    @GetMapping("/owner/sell-requests")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<List<SellRequest>> getAllSellRequests() {
        return ResponseEntity.ok(sellRequestService.getAllSellRequests());
    }

    @PutMapping("/owner/sell-requests/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<SellRequest> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        String notes = payload.get("notes");
        return ResponseEntity.ok(sellRequestService.updateStatus(id, status, notes));
    }

    @PostMapping("/owner/sell-requests/{id}/offer")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<SellRequest> makeOffer(@PathVariable Long id, @RequestBody OfferRequest offerRequest) {
        return ResponseEntity.ok(sellRequestService.makeOffer(id, offerRequest));
    }

    @PostMapping("/owner/sell-requests/{id}/ask-details")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<SellRequest> askDetails(@PathVariable Long id, @RequestBody AskDetailsRequest request) {
        return ResponseEntity.ok(sellRequestService.updateStatus(id, "MORE_DETAILS_REQUIRED", request.getMessage()));
    }

    @PostMapping("/owner/sell-requests/{id}/inspection")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<SellRequest> completeInspection(@PathVariable Long id, @RequestBody InspectionRequest inspectionRequest) {
        return ResponseEntity.ok(sellRequestService.completeInspection(id, inspectionRequest));
    }

    @PostMapping("/owner/sell-requests/{id}/convert-to-inventory")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<Product> convertToInventory(@PathVariable Long id) {
        return ResponseEntity.ok(sellRequestService.purchaseAndConvertToInventory(id));
    }
}
