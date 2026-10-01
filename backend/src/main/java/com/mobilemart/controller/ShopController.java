package com.mobilemart.controller;

import com.mobilemart.model.ShopProfile;
import com.mobilemart.repository.ShopProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private ShopProfileRepository shopProfileRepository;

    @GetMapping("/profile")
    public ResponseEntity<ShopProfile> getShopProfile() {
        ShopProfile profile = shopProfileRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    ShopProfile defaultProfile = new ShopProfile();
                    defaultProfile.setName("MobileMart Certified Used Phones");
                    defaultProfile.setAddress("Tech Bazaar Main Road, City");
                    defaultProfile.setPhone("+919876543210");
                    defaultProfile.setWhatsappNumber("+919876543210");
                    return shopProfileRepository.save(defaultProfile);
                });
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
    public ResponseEntity<ShopProfile> updateShopProfile(@RequestBody ShopProfile profile) {
        ShopProfile existing = shopProfileRepository.findAll().stream().findFirst().orElse(new ShopProfile());
        if (profile.getName() != null) existing.setName(profile.getName());
        if (profile.getLogoUrl() != null) existing.setLogoUrl(profile.getLogoUrl());
        if (profile.getDescription() != null) existing.setDescription(profile.getDescription());
        if (profile.getAddress() != null) existing.setAddress(profile.getAddress());
        if (profile.getPhone() != null) existing.setPhone(profile.getPhone());
        if (profile.getWhatsappNumber() != null) existing.setWhatsappNumber(profile.getWhatsappNumber());
        if (profile.getOpeningHours() != null) existing.setOpeningHours(profile.getOpeningHours());
        if (profile.getGoogleMapUrl() != null) existing.setGoogleMapUrl(profile.getGoogleMapUrl());

        return ResponseEntity.ok(shopProfileRepository.save(existing));
    }
}
