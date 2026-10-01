package com.mobilemart.repository;

import com.mobilemart.model.SellRequest;
import com.mobilemart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellRequestRepository extends JpaRepository<SellRequest, Long> {
    List<SellRequest> findByUserOrderByCreatedAtDesc(User user);
    List<SellRequest> findAllByOrderByCreatedAtDesc();
    Optional<SellRequest> findByRequestNumber(String requestNumber);
    List<SellRequest> findByStatus(String status);
    Long countByStatus(String status);
}
