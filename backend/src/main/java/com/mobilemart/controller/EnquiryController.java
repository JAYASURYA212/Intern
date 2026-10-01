package com.mobilemart.controller;

import com.mobilemart.model.Enquiry;
import com.mobilemart.model.User;
import com.mobilemart.service.AuthService;
import com.mobilemart.service.EnquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EnquiryController {

    @Autowired
    private EnquiryService enquiryService;

    @Autowired
    private AuthService authService;

    @PostMapping("/enquiries")
    public ResponseEntity<Enquiry> createEnquiry(Authentication authentication, @RequestBody Map<String, Object> payload) {
        User user = authentication != null ? authService.getCurrentUser(authentication.getName()) : null;
        Long productId = Long.parseLong(payload.get("productId").toString());
        String customerName = (String) payload.get("customerName");
        String customerPhone = (String) payload.get("customerPhone");
        String message = (String) payload.get("message");

        return ResponseEntity.ok(enquiryService.createEnquiry(user, productId, customerName, customerPhone, message));
    }

    @GetMapping("/enquiries")
    public ResponseEntity<List<Enquiry>> getCustomerEnquiries(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(enquiryService.getCustomerEnquiries(user));
    }

    @GetMapping("/owner/enquiries")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Enquiry>> getAllEnquiries() {
        return ResponseEntity.ok(enquiryService.getAllEnquiries());
    }

    @PutMapping("/owner/enquiries/{id}/reply")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<Enquiry> replyEnquiry(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String replyMessage = payload.get("replyMessage");
        return ResponseEntity.ok(enquiryService.replyToEnquiry(id, replyMessage));
    }
}
