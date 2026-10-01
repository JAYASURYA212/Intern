package com.mobilemart.service;

import com.mobilemart.model.Product;
import com.mobilemart.model.Reservation;
import com.mobilemart.model.User;
import com.mobilemart.repository.ProductRepository;
import com.mobilemart.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private NotificationService notificationService;

    public Reservation createReservation(User user, Long productId, String name, String phone, LocalDate visitDate, String visitTime, String message) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!"AVAILABLE".equals(product.getStatus())) {
            throw new RuntimeException("Product is no longer available for reservation.");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setProduct(product);
        reservation.setCustomerName(name);
        reservation.setCustomerPhone(phone);
        reservation.setVisitDate(visitDate);
        reservation.setVisitTime(visitTime);
        reservation.setMessage(message);
        reservation.setStatus("PENDING");

        Reservation saved = reservationRepository.save(reservation);

        // Update product status to RESERVED
        product.setStatus("RESERVED");
        productRepository.save(product);

        notificationService.createNotification(
                user,
                "Reservation Requested: " + product.getBrand() + " " + product.getModelName(),
                "Your reservation for " + visitDate + " " + (visitTime != null ? visitTime : "") + " is currently PENDING shop confirmation.",
                "RESERVATION",
                "/reservations"
        );

        return saved;
    }

    public List<Reservation> getCustomerReservations(User user) {
        return reservationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc();
    }

    public Reservation updateStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatus(status);
        Reservation saved = reservationRepository.save(reservation);

        Product product = reservation.getProduct();
        if ("CANCELLED".equals(status) || "EXPIRED".equals(status)) {
            if ("RESERVED".equals(product.getStatus())) {
                product.setStatus("AVAILABLE");
                productRepository.save(product);
            }
        } else if ("COMPLETED".equals(status)) {
            product.setStatus("SOLD");
            productRepository.save(product);
        }

        notificationService.createNotification(
                reservation.getUser(),
                "Reservation Status Updated: " + status,
                "Your reservation for " + product.getBrand() + " " + product.getModelName() + " is now " + status + ".",
                "RESERVATION",
                "/reservations"
        );

        return saved;
    }
}
