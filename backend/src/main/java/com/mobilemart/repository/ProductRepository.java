package com.mobilemart.repository;

import com.mobilemart.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    List<Product> findByStatus(String status);
    
    Page<Product> findByStatus(String status, Pageable pageable);

    List<Product> findByIsFeaturedTrueAndStatus(String status);

    List<Product> findByIsDealTrueAndStatus(String status);

    List<Product> findByWarrantyAvailableTrueAndStatus(String status);

    List<Product> findTop10ByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND " +
           "(LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.modelName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.variant) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.storage) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Product> searchAvailableProducts(@Param("query") String query, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.status = :status")
    Long countByStatus(@Param("status") String status);

    Optional<Product> findByInternalStockId(String internalStockId);
}
