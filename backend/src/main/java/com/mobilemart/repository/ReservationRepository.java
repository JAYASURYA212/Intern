package com.mobilemart.repository;

import com.mobilemart.model.Reservation;
import com.mobilemart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserOrderByCreatedAtDesc(User user);
    List<Reservation> findAllByOrderByCreatedAtDesc();
    List<Reservation> findByStatus(String status);
    Long countByStatus(String status);
}
