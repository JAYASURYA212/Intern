package com.mobilemart.repository;

import com.mobilemart.model.Order;
import com.mobilemart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByOrderNumber(String orderNumber);
    
    @Query("SELECT SUM(o.salePrice) FROM Order o WHERE o.status = 'COMPLETED'")
    BigDecimal calculateTotalSalesVolume();
}
