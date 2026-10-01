package com.mobilemart.dto;

import java.math.BigDecimal;
import java.util.List;

public class SellRequestDTOs {

    public static class SellRequestInput {
        private String brand;
        private String modelName;
        private String variant;
        private String storage;
        private String ram;
        private String color;
        private String overallCondition;
        private String batteryHealth;
        private String displayCondition;
        private String bodyCondition;
        private String cameraCondition;
        private String speakerCondition;
        private String chargingCondition;
        private String networkCondition;
        private String additionalIssues;
        private BigDecimal expectedPrice;
        private String customerNotes;
        private List<String> imageUrls;

        // Getters and Setters
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

        public String getCustomerNotes() { return customerNotes; }
        public void setCustomerNotes(String customerNotes) { this.customerNotes = customerNotes; }

        public List<String> getImageUrls() { return imageUrls; }
        public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    }

    public static class OfferRequest {
        private BigDecimal offerPrice;
        private String ownerNotes;

        public BigDecimal getOfferPrice() { return offerPrice; }
        public void setOfferPrice(BigDecimal offerPrice) { this.offerPrice = offerPrice; }

        public String getOwnerNotes() { return ownerNotes; }
        public void setOwnerNotes(String ownerNotes) { this.ownerNotes = ownerNotes; }
    }

    public static class AskDetailsRequest {
        private String message;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class InspectionRequest {
        private String inspectionReportJson;
        private BigDecimal finalPrice;
        private String ownerNotes;

        public String getInspectionReportJson() { return inspectionReportJson; }
        public void setInspectionReportJson(String inspectionReportJson) { this.inspectionReportJson = inspectionReportJson; }

        public BigDecimal getFinalPrice() { return finalPrice; }
        public void setFinalPrice(BigDecimal finalPrice) { this.finalPrice = finalPrice; }

        public String getOwnerNotes() { return ownerNotes; }
        public void setOwnerNotes(String ownerNotes) { this.ownerNotes = ownerNotes; }
    }
}
