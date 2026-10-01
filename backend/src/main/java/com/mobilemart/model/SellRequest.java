package com.mobilemart.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sell_requests")
public class SellRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "request_number", nullable = false, unique = true, length = 50)
    private String requestNumber;

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

    // Condition details submitted by customer
    @Column(name = "overall_condition", nullable = false, length = 30)
    private String overallCondition;

    @Column(name = "battery_health", length = 10)
    private String batteryHealth;

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

    @Column(name = "additional_issues", columnDefinition = "TEXT")
    private String additionalIssues;

    // Prices
    @Column(name = "expected_price", nullable = false)
    private BigDecimal expectedPrice;

    @Column(name = "owner_offer_price")
    private BigDecimal ownerOfferPrice;

    @Column(name = "final_price")
    private BigDecimal finalPrice;

    // Status: SUBMITTED, UNDER_REVIEW, MORE_DETAILS_REQUIRED, INTERESTED, INSPECTION_REQUIRED, OFFER_MADE, CUSTOMER_ACCEPTED, CUSTOMER_REJECTED, PURCHASED, REJECTED, CANCELLED
    @Column(length = 30)
    private String status = "SUBMITTED";

    @Column(name = "owner_notes", columnDefinition = "TEXT")
    private String ownerNotes;

    @Column(name = "customer_notes", columnDefinition = "TEXT")
    private String customerNotes;

    @Column(name = "inspection_report_json", columnDefinition = "TEXT")
    private String inspectionReportJson;

    @Column(name = "created_product_id")
    private Long createdProductId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "sellRequest", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<SellRequestImage> images = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public SellRequest() {}

    public void addImage(SellRequestImage image) {
        images.add(image);
        image.setSellRequest(this);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRequestNumber() { return requestNumber; }
    public void setRequestNumber(String requestNumber) { this.requestNumber = requestNumber; }

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

    public String getAdditionalIssues() { return additionalIssues; }
    public void setAdditionalIssues(String additionalIssues) { this.additionalIssues = additionalIssues; }

    public BigDecimal getExpectedPrice() { return expectedPrice; }
    public void setExpectedPrice(BigDecimal expectedPrice) { this.expectedPrice = expectedPrice; }

    public BigDecimal getOwnerOfferPrice() { return ownerOfferPrice; }
    public void setOwnerOfferPrice(BigDecimal ownerOfferPrice) { this.ownerOfferPrice = ownerOfferPrice; }

    public BigDecimal getFinalPrice() { return finalPrice; }
    public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOwnerNotes() { return ownerNotes; }
    public void setOwnerNotes(String ownerNotes) { this.ownerNotes = ownerNotes; }

    public String getCustomerNotes() { return customerNotes; }
    public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

    public String getInspectionReportJson() { return inspectionReportJson; }
    public void setInspectionReportJson(String inspectionReportJson) { this.inspectionReportJson = inspectionReportJson; }

    public Long getCreatedProductId() { return createdProductId; }
    public void setCreatedProductId(Long createdProductId) { this.createdProductId = createdProductId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<SellRequestImage> getImages() { return images; }
    public void setImages(List<SellRequestImage> images) { this.images = images; }
}
