package com.mobilemart.controller;

import com.mobilemart.model.Reservation;
import com.mobilemart.model.User;
import com.mobilemart.service.AuthService;
import com.mobilemart.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private AuthService authService;

    @PostMapping("/reservations")
    public ResponseEntity<Reservation> createReservation(Authentication authentication, @RequestBody Map<String, Object> payload) {
        User user = authService.getCurrentUser(authentication.getName());
        Long productId = Long.parseLong(payload.get("productId").toString());
        String name = (String) payload.get("customerName");
        String phone = (String) payload.get("customerPhone");
        LocalDate visitDate = LocalDate.parse((String) payload.get("visitDate"));
        String visitTime = (String) payload.get("visitTime");
        String message = (String) payload.get("message");

        return ResponseEntity.ok(reservationService.createReservation(user, productId, name, phone, visitDate, visitTime, message));
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getCustomerReservations(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(reservationService.getCustomerReservations(user));
    }

    @GetMapping("/owner/reservations")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PutMapping("/owner/reservations/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<Reservation> updateReservationStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(reservationService.updateStatus(id, status));
    }
}
