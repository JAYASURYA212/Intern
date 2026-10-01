package com.mobilemart.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AnalyticsDTO {

    private Long totalStockCount;
    private Long availableStockCount;
    private Long reservedStockCount;
    private Long soldStockCount;
    private Long hiddenStockCount;

    private Long todayEnquiriesCount;
    private Long pendingReservationsCount;
    private Long sellRequestsCount;
    private Long warrantyRequestsCount;

    private BigDecimal totalSalesVolume;

    private List<Map<String, Object>> mostViewedProducts;
    private List<Map<String, Object>> highDemandSearches;
    private List<Map<String, Object>> slowMovingStock; // age > 30 days

    // Getters and Setters
    public Long getTotalStockCount() { return totalStockCount; }
    public void setTotalStockCount(Long totalStockCount) { this.totalStockCount = totalStockCount; }

    public Long getAvailableStockCount() { return availableStockCount; }
    public void setAvailableStockCount(Long availableStockCount) { this.availableStockCount = availableStockCount; }

    public Long getReservedStockCount() { return reservedStockCount; }
    public void setReservedStockCount(Long reservedStockCount) { this.reservedStockCount = reservedStockCount; }

    public Long getSoldStockCount() { return soldStockCount; }
    public void setSoldStockCount(Long soldStockCount) { this.soldStockCount = soldStockCount; }

    public Long getHiddenStockCount() { return hiddenStockCount; }
    public void setHiddenStockCount(Long hiddenStockCount) { this.hiddenStockCount = hiddenStockCount; }

    public Long getTodayEnquiriesCount() { return todayEnquiriesCount; }
    public void setTodayEnquiriesCount(Long todayEnquiriesCount) { this.todayEnquiriesCount = todayEnquiriesCount; }

    public Long getPendingReservationsCount() { return pendingReservationsCount; }
    public void setPendingReservationsCount(Long pendingReservationsCount) { this.pendingReservationsCount = pendingReservationsCount; }

    public Long getSellRequestsCount() { return sellRequestsCount; }
    public void setSellRequestsCount(Long sellRequestsCount) { this.sellRequestsCount = sellRequestsCount; }

    public Long getWarrantyRequestsCount() { return warrantyRequestsCount; }
    public void setWarrantyRequestsCount(Long warrantyRequestsCount) { this.warrantyRequestsCount = warrantyRequestsCount; }

    public BigDecimal getTotalSalesVolume() { return totalSalesVolume; }
    public void setTotalSalesVolume(BigDecimal totalSalesVolume) { this.totalSalesVolume = totalSalesVolume; }

    public List<Map<String, Object>> getMostViewedProducts() { return mostViewedProducts; }
    public void setMostViewedProducts(List<Map<String, Object>> mostViewedProducts) { this.mostViewedProducts = mostViewedProducts; }

    public List<Map<String, Object>> getHighDemandSearches() { return highDemandSearches; }
    public void setHighDemandSearches(List<Map<String, Object>> highDemandSearches) { this.highDemandSearches = highDemandSearches; }

    public List<Map<String, Object>> getSlowMovingStock() { return slowMovingStock; }
    public void setSlowMovingStock(List<Map<String, Object>> slowMovingStock) { this.slowMovingStock = slowMovingStock; }
}
