package com.mobilemart.controller;

import com.mobilemart.dto.ProductDTOs.BulkImportResult;
import com.mobilemart.model.Product;
import com.mobilemart.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasAnyAuthority('ROLE_SHOP_OWNER', 'ROLE_ADMIN')")
public class InventoryController {

    @Autowired
    private ProductService productService;

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return ResponseEntity.ok(productService.saveProduct(product));
    }

    @PutMapping("/products/{id}/status")
    public ResponseEntity<Product> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(productService.updateStatus(id, status));
    }

    @PutMapping("/products/{id}/feature")
    public ResponseEntity<Product> featureProduct(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String videoUrl = payload.get("videoUrl");
        return ResponseEntity.ok(productService.setFeaturedMobile(id, videoUrl));
    }

    @PostMapping("/inventory/import")
    public ResponseEntity<BulkImportResult> bulkImport(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(productService.bulkImportCSV(file));
    }
}
