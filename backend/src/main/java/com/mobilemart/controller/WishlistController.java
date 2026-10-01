package com.mobilemart.controller;

import com.mobilemart.model.Product;
import com.mobilemart.model.User;
import com.mobilemart.model.Wishlist;
import com.mobilemart.repository.ProductRepository;
import com.mobilemart.repository.WishlistRepository;
import com.mobilemart.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist(Authentication authentication) {
        User user = authService.getCurrentUser(authentication.getName());
        List<Wishlist> items = wishlistRepository.findByUserOrderByCreatedAtDesc(user);
        List<Product> products = items.stream().map(Wishlist::getProduct).collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, String>> toggleWishlist(Authentication authentication, @PathVariable Long productId) {
        User user = authService.getCurrentUser(authentication.getName());
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            wishlistRepository.deleteByUserAndProduct(user, product);
            return ResponseEntity.ok(Map.of("status", "removed"));
        } else {
            Wishlist item = new Wishlist(user, product);
            wishlistRepository.save(item);
            return ResponseEntity.ok(Map.of("status", "added"));
        }
    }
}
