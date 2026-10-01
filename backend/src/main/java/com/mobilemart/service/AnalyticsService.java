package com.mobilemart.service;

import com.mobilemart.dto.AnalyticsDTO;
import com.mobilemart.model.Product;
import com.mobilemart.model.SearchHistory;
import com.mobilemart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private SellRequestRepository sellRequestRepository;

    @Autowired
    private WarrantyClaimRepository warrantyClaimRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SearchHistoryRepository searchHistoryRepository;

    public AnalyticsDTO getDashboardAnalytics() {
        AnalyticsDTO dto = new AnalyticsDTO();

        dto.setTotalStockCount(productRepository.count());
        dto.setAvailableStockCount(productRepository.countByStatus("AVAILABLE"));
        dto.setReservedStockCount(productRepository.countByStatus("RESERVED"));
        dto.setSoldStockCount(productRepository.countByStatus("SOLD"));
        dto.setHiddenStockCount(productRepository.countByStatus("HIDDEN"));

        dto.setTodayEnquiriesCount(enquiryRepository.count());
        dto.setPendingReservationsCount(reservationRepository.countByStatus("PENDING"));
        dto.setSellRequestsCount(sellRequestRepository.countByStatus("SUBMITTED"));
        dto.setWarrantyRequestsCount(warrantyClaimRepository.countByStatus("SUBMITTED"));

        BigDecimal totalSales = orderRepository.calculateTotalSalesVolume();
        dto.setTotalSalesVolume(totalSales != null ? totalSales : BigDecimal.ZERO);

        // Most viewed products
        List<Product> allProducts = productRepository.findAll();
        allProducts.sort((a, b) -> Integer.compare(b.getViewsCount() != null ? b.getViewsCount() : 0, a.getViewsCount() != null ? a.getViewsCount() : 0));
        
        List<Map<String, Object>> mostViewed = new ArrayList<>();
        for (int i = 0; i < Math.min(5, allProducts.size()); i++) {
            Product p = allProducts.get(i);
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("brand", p.getBrand());
            map.put("modelName", p.getModelName());
            map.put("viewsCount", p.getViewsCount());
            map.put("sellingPrice", p.getSellingPrice());
            mostViewed.add(map);
        }
        dto.setMostViewedProducts(mostViewed);

        // High demand search terms
        List<SearchHistory> searches = searchHistoryRepository.findTopPopularSearches();
        List<Map<String, Object>> searchDemand = new ArrayList<>();
        for (int i = 0; i < Math.min(5, searches.size()); i++) {
            SearchHistory s = searches.get(i);
            Map<String, Object> map = new HashMap<>();
            map.put("queryKeyword", s.getQueryKeyword());
            map.put("searchCount", s.getSearchCount());
            searchDemand.add(map);
        }
        dto.setHighDemandSearches(searchDemand);

        // Slow moving stock (age > 30 days)
        List<Map<String, Object>> slowMoving = new ArrayList<>();
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        for (Product p : allProducts) {
            if ("AVAILABLE".equals(p.getStatus()) && p.getCreatedAt() != null && p.getCreatedAt().isBefore(thirtyDaysAgo)) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", p.getId());
                map.put("brand", p.getBrand());
                map.put("modelName", p.getModelName());
                map.put("storage", p.getStorage());
                map.put("sellingPrice", p.getSellingPrice());
                map.put("daysListed", java.time.Duration.between(p.getCreatedAt(), LocalDateTime.now()).toDays());
                slowMoving.add(map);
            }
        }
        dto.setSlowMovingStock(slowMoving);

        return dto;
    }
}
