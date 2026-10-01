package com.mobilemart.repository;

import com.mobilemart.model.Enquiry;
import com.mobilemart.model.Product;
import com.mobilemart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByUserOrderByCreatedAtDesc(User user);
    List<Enquiry> findAllByOrderByCreatedAtDesc();
    List<Enquiry> findByProduct(Product product);
    Long countByStatus(String status);
}
