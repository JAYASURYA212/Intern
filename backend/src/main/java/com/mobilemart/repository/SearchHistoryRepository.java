package com.mobilemart.repository;

import com.mobilemart.model.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {
    Optional<SearchHistory> findByQueryKeywordIgnoreCase(String queryKeyword);
    
    @Query("SELECT s FROM SearchHistory s ORDER BY s.searchCount DESC")
    List<SearchHistory> findTopPopularSearches();
}
