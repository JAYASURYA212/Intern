package com.mobilemart.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "sell_request_images")
public class SellRequestImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sell_request_id", nullable = false)
    @JsonIgnore
    private SellRequest sellRequest;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    public SellRequestImage() {}

    public SellRequestImage(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SellRequest getSellRequest() { return sellRequest; }
    public void setSellRequest(SellRequest sellRequest) { this.sellRequest = sellRequest; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
