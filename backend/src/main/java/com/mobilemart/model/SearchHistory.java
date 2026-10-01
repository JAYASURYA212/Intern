package com.mobilemart.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "search_history")
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "query_keyword", nullable = false, length = 100)
    private String queryKeyword;

    @Column(length = 50)
    private String brand;

    @Column(name = "search_count")
    private Integer searchCount = 1;

    @Column(name = "last_searched")
    private LocalDateTime lastSearched;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.lastSearched = LocalDateTime.now();
    }

    public SearchHistory() {}

    public SearchHistory(String queryKeyword, String brand) {
        this.queryKeyword = queryKeyword;
        this.brand = brand;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQueryKeyword() { return queryKeyword; }
    public void setQueryKeyword(String queryKeyword) { this.queryKeyword = queryKeyword; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Integer getSearchCount() { return searchCount; }
    public void setSearchCount(Integer searchCount) { this.searchCount = searchCount; }

    public LocalDateTime getLastSearched() { return lastSearched; }
    public void setLastSearched(LocalDateTime lastSearched) { this.lastSearched = lastSearched; }
}
