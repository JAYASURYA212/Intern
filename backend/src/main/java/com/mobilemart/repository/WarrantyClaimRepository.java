package com.mobilemart.repository;

import com.mobilemart.model.User;
import com.mobilemart.model.WarrantyClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarrantyClaimRepository extends JpaRepository<WarrantyClaim, Long> {
    List<WarrantyClaim> findByUserOrderByCreatedAtDesc(User user);
    List<WarrantyClaim> findAllByOrderByCreatedAtDesc();
    Long countByStatus(String status);
}
