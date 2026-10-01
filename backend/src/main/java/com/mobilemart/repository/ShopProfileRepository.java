package com.mobilemart.repository;

import com.mobilemart.model.ShopProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopProfileRepository extends JpaRepository<ShopProfile, Long> {
}
