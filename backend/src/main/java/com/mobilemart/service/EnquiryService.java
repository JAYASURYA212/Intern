package com.mobilemart.service;

import com.mobilemart.model.Enquiry;
import com.mobilemart.model.Product;
import com.mobilemart.model.User;
import com.mobilemart.repository.EnquiryRepository;
import com.mobilemart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnquiryService {

    @Autowired
    private EnquiryRepository enquiryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private NotificationService notificationService;

    public Enquiry createEnquiry(User user, Long productId, String customerName, String customerPhone, String message) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Enquiry enquiry = new Enquiry();
        enquiry.setUser(user);
        enquiry.setProduct(product);
        enquiry.setCustomerName(customerName != null ? customerName : (user != null ? user.getFullName() : "Guest"));
        enquiry.setCustomerPhone(customerPhone != null ? customerPhone : (user != null ? user.getPhone() : ""));
        enquiry.setMessage(message);
        enquiry.setStatus("PENDING");

        Enquiry saved = enquiryRepository.save(enquiry);

        if (user != null) {
            notificationService.createNotification(
                    user,
                    "Enquiry Sent for " + product.getBrand() + " " + product.getModelName(),
                    "Your message: \"" + message + "\" has been sent to the shop owner.",
                    "ENQUIRY",
                    "/enquiries"
            );
        }

        return saved;
    }

    public List<Enquiry> getCustomerEnquiries(User user) {
        return enquiryRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAllByOrderByCreatedAtDesc();
    }

    public Enquiry replyToEnquiry(Long id, String replyMessage) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enquiry not found"));

        enquiry.setReplyMessage(replyMessage);
        enquiry.setStatus("REPLIED");
        Enquiry saved = enquiryRepository.save(enquiry);

        if (enquiry.getUser() != null) {
            notificationService.createNotification(
                    enquiry.getUser(),
                    "Shop Replied to Enquiry (" + enquiry.getProduct().getModelName() + ")",
                    replyMessage,
                    "ENQUIRY",
                    "/enquiries"
            );
        }

        return saved;
    }
}
