package com.mobilemart.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String brand;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(length = 50)
    private String variant;

    @Column(nullable = false, length = 20)
    private String storage;

    @Column(length = 20)
    private String ram;

    @Column(length = 30)
    private String color;

    // Condition details
    @Column(name = "overall_condition", nullable = false, length = 30)
    private String overallCondition; // EXCELLENT, VERY_GOOD, GOOD, FAIR

    @Column(name = "battery_health", length = 10)
    private String batteryHealth; // e.g. "89%"

    @Column(name = "display_condition", length = 100)
    private String displayCondition;

    @Column(name = "body_condition", length = 100)
    private String bodyCondition;

    @Column(name = "camera_condition", length = 100)
    private String cameraCondition;

    @Column(name = "speaker_condition", length = 100)
    private String speakerCondition;

    @Column(name = "charging_condition", length = 100)
    private String chargingCondition;

    @Column(name = "network_condition", length = 100)
    private String networkCondition;

    // Accessories
    private Boolean boxIncluded = false;
    private Boolean chargerIncluded = false;
    private Boolean cableIncluded = false;
    private Boolean billIncluded = false;
    private Boolean caseIncluded = false;
    private Boolean earphonesIncluded = false;

    // Pricing
    @Column(name = "original_price")
    private BigDecimal originalPrice;

    @Column(name = "selling_price", nullable = false)
    private BigDecimal sellingPrice;

    private Boolean isNegotiable = false;

    // Warranty
    private Boolean warrantyAvailable = false;
    private Integer warrantyMonths = 0;
    private String warrantyType; // "Shop Warranty", "Brand Warranty"
    private LocalDate warrantyStartDate;
    private LocalDate warrantyEndDate;

    // Status: AVAILABLE, RESERVED, SOLD, HIDDEN, DRAFT
    @Column(nullable = false, length = 20)
    private String status = "AVAILABLE";

    // Daily Featured Mobile
    private Boolean isFeatured = false;
    @Column(name = "featured_video_url", length = 500)
    private String featuredVideoUrl;

    // Deals
    private Boolean isDeal = false;
    private BigDecimal dealOldPrice;
    private BigDecimal dealNewPrice;

    // Analytics
    private Integer viewsCount = 0;

    // Internal fields (for shop owner)
    private String imei1;
    private String imei2;
    private String purchaseSource;
    private LocalDate purchaseDate;
    private String internalStockId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProductImage> images = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.viewsCount == null) this.viewsCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Product() {}

    // Helper to add image
    public void addImage(ProductImage image) {
        images.add(image);
        image.setProduct(this);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getVariant() { return variant; }
    public void setVariant(String variant) { this.variant = variant; }

    public String getStorage() { return storage; }
    public void setStorage(String storage) { this.storage = storage; }

    public String getRam() { return ram; }
    public void setRam(String ram) { this.ram = ram; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getOverallCondition() { return overallCondition; }
    public void setOverallCondition(String overallCondition) { this.overallCondition = overallCondition; }

    public String getBatteryHealth() { return batteryHealth; }
    public void setBatteryHealth(String batteryHealth) { this.batteryHealth = batteryHealth; }

    public String getDisplayCondition() { return displayCondition; }
    public void setDisplayCondition(String displayCondition) { this.displayCondition = displayCondition; }

    public String getBodyCondition() { return bodyCondition; }
    public void setBodyCondition(String bodyCondition) { this.bodyCondition = bodyCondition; }

    public String getCameraCondition() { return cameraCondition; }
    public void setCameraCondition(String cameraCondition) { this.cameraCondition = cameraCondition; }

    public String getSpeakerCondition() { return speakerCondition; }
    public void setSpeakerCondition(String speakerCondition) { this.speakerCondition = speakerCondition; }

    public String getChargingCondition() { return chargingCondition; }
    public void setChargingCondition(String chargingCondition) { this.chargingCondition = chargingCondition; }

    public String getNetworkCondition() { return networkCondition; }
    public void setNetworkCondition(String networkCondition) { this.networkCondition = networkCondition; }

    public Boolean getBoxIncluded() { return boxIncluded; }
    public void setBoxIncluded(Boolean boxIncluded) { this.boxIncluded = boxIncluded; }

    public Boolean getChargerIncluded() { return chargerIncluded; }
    public void setChargerIncluded(Boolean chargerIncluded) { this.chargerIncluded = chargerIncluded; }

    public Boolean getCableIncluded() { return cableIncluded; }
    public void setCableIncluded(Boolean cableIncluded) { this.cableIncluded = cableIncluded; }

    public Boolean getBillIncluded() { return billIncluded; }
    public void setBillIncluded(Boolean billIncluded) { this.billIncluded = billIncluded; }

    public Boolean getCaseIncluded() { return caseIncluded; }
    public void setCaseIncluded(Boolean caseIncluded) { this.caseIncluded = caseIncluded; }

    public Boolean getEarphonesIncluded() { return earphonesIncluded; }
    public void setEarphonesIncluded(Boolean earphonesIncluded) { this.earphonesIncluded = earphonesIncluded; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public BigDecimal getSellingPrice() { return sellingPrice; }
    public void setSellingPrice(BigDecimal sellingPrice) { this.sellingPrice = sellingPrice; }

    public Boolean getIsNegotiable() { return isNegotiable; }
    public void setIsNegotiable(Boolean isNegotiable) { this.isNegotiable = isNegotiable; }

    public Boolean getWarrantyAvailable() { return warrantyAvailable; }
    public void setWarrantyAvailable(Boolean warrantyAvailable) { this.warrantyAvailable = warrantyAvailable; }

    public Integer getWarrantyMonths() { return warrantyMonths; }
    public void setWarrantyMonths(Integer warrantyMonths) { this.warrantyMonths = warrantyMonths; }

    public String getWarrantyType() { return warrantyType; }
    public void setWarrantyType(String warrantyType) { this.warrantyType = warrantyType; }

    public LocalDate getWarrantyStartDate() { return warrantyStartDate; }
    public void setWarrantyStartDate(LocalDate warrantyStartDate) { this.warrantyStartDate = warrantyStartDate; }

    public LocalDate getWarrantyEndDate() { return warrantyEndDate; }
    public void setWarrantyEndDate(LocalDate warrantyEndDate) { this.warrantyEndDate = warrantyEndDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public String getFeaturedVideoUrl() { return featuredVideoUrl; }
    public void setFeaturedVideoUrl(String featuredVideoUrl) { this.featuredVideoUrl = featuredVideoUrl; }

    public Boolean getIsDeal() { return isDeal; }
    public void setIsDeal(Boolean isDeal) { this.isDeal = isDeal; }

    public BigDecimal getDealOldPrice() { return dealOldPrice; }
    public void setDealOldPrice(BigDecimal dealOldPrice) { this.dealOldPrice = dealOldPrice; }

    public BigDecimal getDealNewPrice() { return dealNewPrice; }
    public void setDealNewPrice(BigDecimal dealNewPrice) { this.dealNewPrice = dealNewPrice; }

    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }

    public String getImei1() { return imei1; }
    public void setImei1(String imei1) { this.imei1 = imei1; }

    public String getImei2() { return imei2; }
    public void setImei2(String imei2) { this.imei2 = imei2; }

    public String getPurchaseSource() { return purchaseSource; }
    public void setPurchaseSource(String purchaseSource) { this.purchaseSource = purchaseSource; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

    public String getInternalStockId() { return internalStockId; }
    public void setInternalStockId(String internalStockId) { this.internalStockId = internalStockId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }
}
