package com.mobilemart.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ProductDTOs {

    public static class ProductFilterRequest {
        private String search;
        private List<String> brands;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private List<String> storage;
        private List<String> ram;
        private List<String> condition;
        private Boolean warrantyAvailable;
        private String status = "AVAILABLE"; // AVAILABLE, RESERVED, SOLD, HIDDEN
        private String sortBy = "newest"; // price_asc, price_desc, newest, most_viewed
        private int page = 0;
        private int size = 20;

        public String getSearch() { return search; }
        public void setSearch(String search) { this.search = search; }

        public List<String> getBrands() { return brands; }
        public void setBrands(List<String> brands) { this.brands = brands; }

        public BigDecimal getMinPrice() { return minPrice; }
        public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

        public BigDecimal getMaxPrice() { return maxPrice; }
        public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

        public List<String> getStorage() { return storage; }
        public void setStorage(List<String> storage) { this.storage = storage; }

        public List<String> getRam() { return ram; }
        public void setRam(List<String> ram) { this.ram = ram; }

        public List<String> getCondition() { return condition; }
        public void setCondition(List<String> condition) { this.condition = condition; }

        public Boolean getWarrantyAvailable() { return warrantyAvailable; }
        public void setWarrantyAvailable(Boolean warrantyAvailable) { this.warrantyAvailable = warrantyAvailable; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getSortBy() { return sortBy; }
        public void setSortBy(String sortBy) { this.sortBy = sortBy; }

        public int getPage() { return page; }
        public void setPage(int page) { this.page = page; }

        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }
    }

    public static class BulkImportResult {
        private int totalRows;
        private int validCount;
        private int invalidCount;
        private List<String> errors;

        public BulkImportResult(int totalRows, int validCount, int invalidCount, List<String> errors) {
            this.totalRows = totalRows;
            this.validCount = validCount;
            this.invalidCount = invalidCount;
            this.errors = errors;
        }

        public int getTotalRows() { return totalRows; }
        public int getValidCount() { return validCount; }
        public int getInvalidCount() { return invalidCount; }
        public List<String> getErrors() { return errors; }
    }
}
