package com.mobilemart.service;

import com.mobilemart.dto.SellRequestDTOs.*;
import com.mobilemart.model.*;
import com.mobilemart.repository.ProductRepository;
import com.mobilemart.repository.SellRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SellRequestService {

    @Autowired
    private SellRequestRepository sellRequestRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private NotificationService notificationService;

    public SellRequest createSellRequest(User user, SellRequestInput input) {
        SellRequest request = new SellRequest();
        request.setUser(user);
        request.setRequestNumber("SR" + (System.currentTimeMillis() % 1000000));
        request.setBrand(input.getBrand());
        request.setModelName(input.getModelName());
        request.setVariant(input.getVariant());
        request.setStorage(input.getStorage());
        request.setRam(input.getRam());
        request.setColor(input.getColor());

        request.setOverallCondition(input.getOverallCondition());
        request.setBatteryHealth(input.getBatteryHealth());
        request.setDisplayCondition(input.getDisplayCondition());
        request.setBodyCondition(input.getBodyCondition());
        request.setCameraCondition(input.getCameraCondition());
        request.setSpeakerCondition(input.getSpeakerCondition());
        request.setChargingCondition(input.getChargingCondition());
        request.setNetworkCondition(input.getNetworkCondition());
        request.setAdditionalIssues(input.getAdditionalIssues());

        request.setExpectedPrice(input.getExpectedPrice());
        request.setCustomerNotes(input.getCustomerNotes());
        request.setStatus("SUBMITTED");

        if (input.getImageUrls() != null) {
            for (String url : input.getImageUrls()) {
                request.addImage(new SellRequestImage(url));
            }
        }

        SellRequest saved = sellRequestRepository.save(request);

        // Notify customer
        notificationService.createNotification(
                user,
                "Sell Request Submitted (" + saved.getRequestNumber() + ")",
                "Your sell request for " + saved.getBrand() + " " + saved.getModelName() + " has been received and is under shop review.",
                "SELL_REQUEST",
                "/sell-requests/" + saved.getId()
        );

        return saved;
    }

    public List<SellRequest> getCustomerSellRequests(User user) {
        return sellRequestRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<SellRequest> getAllSellRequests() {
        return sellRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public SellRequest getSellRequestById(Long id) {
        return sellRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sell request not found with id: " + id));
    }

    public SellRequest updateStatus(Long id, String status, String ownerNotes) {
        SellRequest request = getSellRequestById(id);
        request.setStatus(status);
        if (ownerNotes != null) request.setOwnerNotes(ownerNotes);
        
        SellRequest updated = sellRequestRepository.save(request);

        // Notify Customer
        notificationService.createNotification(
                request.getUser(),
                "Sell Request Update (" + request.getRequestNumber() + ")",
                "Status updated to " + status + ". " + (ownerNotes != null ? ownerNotes : ""),
                "SELL_REQUEST",
                "/sell-requests/" + request.getId()
        );

        return updated;
    }

    public SellRequest makeOffer(Long id, OfferRequest offerRequest) {
        SellRequest request = getSellRequestById(id);
        request.setOwnerOfferPrice(offerRequest.getOfferPrice());
        request.setStatus("OFFER_MADE");
        if (offerRequest.getOwnerNotes() != null) {
            request.setOwnerNotes(offerRequest.getOwnerNotes());
        }

        SellRequest updated = sellRequestRepository.save(request);

        notificationService.createNotification(
                request.getUser(),
                "Offer Received for " + request.getRequestNumber(),
                "The shop owner offered ₹" + offerRequest.getOfferPrice() + " for your phone!",
                "SELL_REQUEST",
                "/sell-requests/" + request.getId()
        );

        return updated;
    }

    public SellRequest respondToOffer(Long id, User user, boolean accept) {
        SellRequest request = getSellRequestById(id);
        if (!request.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized action");
        }

        if (accept) {
            request.setStatus("CUSTOMER_ACCEPTED");
            request.setFinalPrice(request.getOwnerOfferPrice());
        } else {
            request.setStatus("CUSTOMER_REJECTED");
        }

        return sellRequestRepository.save(request);
    }

    public SellRequest completeInspection(Long id, InspectionRequest inspectionRequest) {
        SellRequest request = getSellRequestById(id);
        request.setInspectionReportJson(inspectionRequest.getInspectionReportJson());
        if (inspectionRequest.getFinalPrice() != null) {
            request.setFinalPrice(inspectionRequest.getFinalPrice());
        }
        if (inspectionRequest.getOwnerNotes() != null) {
            request.setOwnerNotes(inspectionRequest.getOwnerNotes());
        }
        request.setStatus("INSPECTION_REQUIRED");
        return sellRequestRepository.save(request);
    }

    @Transactional
    public Product purchaseAndConvertToInventory(Long id) {
        SellRequest request = getSellRequestById(id);
        request.setStatus("PURCHASED");

        // Create new Product Draft automatically
        Product product = new Product();
        product.setBrand(request.getBrand());
        product.setModelName(request.getModelName());
        product.setVariant(request.getVariant());
        product.setStorage(request.getStorage());
        product.setRam(request.getRam());
        product.setColor(request.getColor());

        product.setOverallCondition(request.getOverallCondition());
        product.setBatteryHealth(request.getBatteryHealth());
        product.setDisplayCondition(request.getDisplayCondition());
        product.setBodyCondition(request.getBodyCondition());
        product.setCameraCondition(request.getCameraCondition());
        product.setSpeakerCondition(request.getSpeakerCondition());
        product.setChargingCondition(request.getChargingCondition());
        product.setNetworkCondition(request.getNetworkCondition());

        product.setOriginalPrice(request.getExpectedPrice());
        // Default markup for resale selling price
        product.setSellingPrice(request.getFinalPrice() != null ? request.getFinalPrice().multiply(new java.math.BigDecimal("1.2")) : request.getExpectedPrice());
        product.setWarrantyAvailable(true);
        product.setWarrantyMonths(3);
        product.setWarrantyType("Shop Warranty");

        product.setPurchaseSource("Customer Sell Request #" + request.getRequestNumber());
        product.setPurchaseDate(java.time.LocalDate.now());
        product.setStatus("DRAFT");

        // Copy images
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            for (int i = 0; i < request.getImages().size(); i++) {
                ProductImage pImg = new ProductImage(request.getImages().get(i).getImageUrl(), i == 0);
                product.addImage(pImg);
            }
        }

        Product savedProduct = productRepository.save(product);

        request.setCreatedProductId(savedProduct.getId());
        sellRequestRepository.save(request);

        notificationService.createNotification(
                request.getUser(),
                "Phone Purchased Successfully (" + request.getRequestNumber() + ")",
                "Payment of ₹" + request.getFinalPrice() + " has been processed for your " + request.getBrand() + " " + request.getModelName() + ". Thank you!",
                "SELL_REQUEST",
                "/sell-requests/" + request.getId()
        );

        return savedProduct;
    }
}
