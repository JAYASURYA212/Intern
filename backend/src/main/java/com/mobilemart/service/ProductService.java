package com.mobilemart.service;

import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mobilemart.dto.ProductDTOs.*;
import com.mobilemart.dto.ProductDTOs.BulkImportResult;
import com.mobilemart.dto.ProductDTOs.ProductFilterRequest;
import com.mobilemart.model.Product;
import com.mobilemart.model.SearchHistory;
import com.mobilemart.repository.BrandRepository;
import com.mobilemart.repository.ProductRepository;
import com.mobilemart.repository.SearchHistoryRepository;

import jakarta.persistence.criteria.Predicate;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    public Page<Product> filterProducts(ProductFilterRequest request) {
        // Record search keyword in SearchHistory
        if (request.getSearch() != null && !request.getSearch().trim().isEmpty()) {
            recordSearchQuery(request.getSearch().trim());
        }

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equalsIgnoreCase(request.getSortBy())) {
            sort = Sort.by(Sort.Direction.ASC, "sellingPrice");
        } else if ("price_desc".equalsIgnoreCase(request.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "sellingPrice");
        } else if ("most_viewed".equalsIgnoreCase(request.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "viewsCount");
        }

        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Status filter (Default AVAILABLE)
            if (request.getStatus() != null && !request.getStatus().equalsIgnoreCase("ALL")) {
                predicates.add(cb.equal(root.get("status"), request.getStatus()));
            }

            // Keyword Search
            if (request.getSearch() != null && !request.getSearch().trim().isEmpty()) {
                String term = "%" + request.getSearch().trim().toLowerCase() + "%";
                Predicate brandLike = cb.like(cb.lower(root.get("brand")), term);
                Predicate modelLike = cb.like(cb.lower(root.get("modelName")), term);
                Predicate variantLike = cb.like(cb.lower(root.get("variant")), term);
                Predicate storageLike = cb.like(cb.lower(root.get("storage")), term);
                predicates.add(cb.or(brandLike, modelLike, variantLike, storageLike));
            }

            // Brands Filter
            if (request.getBrands() != null && !request.getBrands().isEmpty()) {
                predicates.add(root.get("brand").in(request.getBrands()));
            }

            // Price Min/Max
            if (request.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("sellingPrice"), request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("sellingPrice"), request.getMaxPrice()));
            }

            // Storage
            if (request.getStorage() != null && !request.getStorage().isEmpty()) {
                predicates.add(root.get("storage").in(request.getStorage()));
            }

            // RAM
            if (request.getRam() != null && !request.getRam().isEmpty()) {
                predicates.add(root.get("ram").in(request.getRam()));
            }

            // Condition
            if (request.getCondition() != null && !request.getCondition().isEmpty()) {
                predicates.add(root.get("overallCondition").in(request.getCondition()));
            }

            // Warranty
            if (Boolean.TRUE.equals(request.getWarrantyAvailable())) {
                predicates.add(cb.equal(root.get("warrantyAvailable"), true));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable);
    }

    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        // Increment view count
        product.setViewsCount((product.getViewsCount() == null ? 0 : product.getViewsCount()) + 1);
        return productRepository.save(product);
    }

    public Product saveProduct(Product product) {
        if (product.getInternalStockId() == null || product.getInternalStockId().trim().isEmpty()) {
            product.setInternalStockId("MM-" + (System.currentTimeMillis() % 1000000));
        }
        return productRepository.save(product);
    }

    public Product updateStatus(Long id, String status) {
        Product product = getProductById(id);
        product.setStatus(status);
        return productRepository.save(product);
    }

    public Product setFeaturedMobile(Long id, String videoUrl) {
        // Reset previous featured mobiles
        List<Product> previousFeatured = productRepository.findByIsFeaturedTrueAndStatus("AVAILABLE");
        for (Product p : previousFeatured) {
            p.setIsFeatured(false);
            productRepository.save(p);
        }

        Product product = getProductById(id);
        product.setIsFeatured(true);
        if (videoUrl != null && !videoUrl.trim().isEmpty()) {
            product.setFeaturedVideoUrl(videoUrl);
        }
        return productRepository.save(product);
    }

    public Product getFeaturedMobile() {
        List<Product> featuredList = productRepository.findByIsFeaturedTrueAndStatus("AVAILABLE");
        if (!featuredList.isEmpty()) {
            return featuredList.get(0);
        }
        // Fallback to top available product
        List<Product> topList = productRepository.findTop10ByStatusOrderByCreatedAtDesc("AVAILABLE");
        return topList.isEmpty() ? null : topList.get(0);
    }

    public List<Product> getDeals() {
        return productRepository.findByIsDealTrueAndStatus("AVAILABLE");
    }

    public List<Product> getNewArrivals() {
        return productRepository.findTop10ByStatusOrderByCreatedAtDesc("AVAILABLE");
    }

    public List<Product> getWarrantyMobiles() {
        return productRepository.findByWarrantyAvailableTrueAndStatus("AVAILABLE");
    }

    public BulkImportResult bulkImportCSV(MultipartFile file) {
        List<String> errors = new ArrayList<>();
        int total = 0;
        int valid = 0;
        int invalid = 0;

        try (Reader reader = new InputStreamReader(file.getInputStream())) {
            CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());
            
            for (CSVRecord record : csvParser) {
                total++;
                try {
                    String brand = record.get("Brand");
                    String modelName = record.get("Model");
                    String storage = record.get("Storage");
                    String priceStr = record.get("SellingPrice");

                    if (brand == null || brand.isEmpty() || modelName == null || modelName.isEmpty() ||
                        storage == null || storage.isEmpty() || priceStr == null || priceStr.isEmpty()) {
                        errors.add("Row " + total + ": Missing required fields (Brand, Model, Storage, SellingPrice)");
                        invalid++;
                        continue;
                    }

                    BigDecimal price = new BigDecimal(priceStr);
                    Product product = new Product();
                    product.setBrand(brand);
                    product.setModelName(modelName);
                    product.setStorage(storage);
                    product.setSellingPrice(price);
                    product.setOverallCondition(record.isSet("Condition") ? record.get("Condition") : "EXCELLENT");
                    product.setBatteryHealth(record.isSet("BatteryHealth") ? record.get("BatteryHealth") : "90%");
                    product.setRam(record.isSet("RAM") ? record.get("RAM") : "8GB");
                    product.setColor(record.isSet("Color") ? record.get("Color") : "Black");
                    product.setWarrantyAvailable(record.isSet("WarrantyMonths") && Integer.parseInt(record.get("WarrantyMonths")) > 0);
                    if (product.getWarrantyAvailable()) {
                        product.setWarrantyMonths(Integer.parseInt(record.get("WarrantyMonths")));
                        product.setWarrantyType("Shop Warranty");
                    }
                    product.setStatus("AVAILABLE");

                    saveProduct(product);
                    valid++;
                } catch (Exception ex) {
                    invalid++;
                    errors.add("Row " + total + ": " + ex.getMessage());
                }
            }
        } catch (Exception ex) {
            throw new RuntimeException("Failed to parse CSV file: " + ex.getMessage());
        }

        return new BulkImportResult(total, valid, invalid, errors);
    }

    private void recordSearchQuery(String query) {
        searchHistoryRepository.findByQueryKeywordIgnoreCase(query).ifPresentOrElse(history -> {
            history.setSearchCount(history.getSearchCount() + 1);
            searchHistoryRepository.save(history);
        }, () -> {
            SearchHistory history = new SearchHistory(query, null);
            searchHistoryRepository.save(history);
        });
    }
}
