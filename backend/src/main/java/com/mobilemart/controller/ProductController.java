package com.mobilemart.controller;

import com.mobilemart.dto.ProductDTOs.ProductFilterRequest;
import com.mobilemart.model.Brand;
import com.mobilemart.model.Product;
import com.mobilemart.repository.BrandRepository;
import com.mobilemart.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private BrandRepository brandRepository;

    @PostMapping("/products/filter")
    public ResponseEntity<Page<Product>> filterProducts(@RequestBody ProductFilterRequest request) {
        return ResponseEntity.ok(productService.filterProducts(request));
    }

    @GetMapping("/products")
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) List<String> storage,
            @RequestParam(required = false) List<String> ram,
            @RequestParam(required = false) List<String> condition,
            @RequestParam(required = false) Boolean warranty,
            @RequestParam(defaultValue = "AVAILABLE") String status,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        ProductFilterRequest req = new ProductFilterRequest();
        req.setSearch(search);
        req.setBrands(brand);
        req.setMinPrice(minPrice);
        req.setMaxPrice(maxPrice);
        req.setStorage(storage);
        req.setRam(ram);
        req.setCondition(condition);
        req.setWarrantyAvailable(warranty);
        req.setStatus(status);
        req.setSortBy(sortBy);
        req.setPage(page);
        req.setSize(size);

        return ResponseEntity.ok(productService.filterProducts(req));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/products/featured-today")
    public ResponseEntity<Product> getFeaturedMobile() {
        return ResponseEntity.ok(productService.getFeaturedMobile());
    }

    @GetMapping("/products/deals")
    public ResponseEntity<List<Product>> getDeals() {
        return ResponseEntity.ok(productService.getDeals());
    }

    @GetMapping("/products/new-arrivals")
    public ResponseEntity<List<Product>> getNewArrivals() {
        return ResponseEntity.ok(productService.getNewArrivals());
    }

    @GetMapping("/products/warranty-mobiles")
    public ResponseEntity<List<Product>> getWarrantyMobiles() {
        return ResponseEntity.ok(productService.getWarrantyMobiles());
    }

    @GetMapping("/brands")
    public ResponseEntity<List<Brand>> getBrands() {
        return ResponseEntity.ok(brandRepository.findAll());
    }
}
