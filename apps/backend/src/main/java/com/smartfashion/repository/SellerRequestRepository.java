package com.smartfashion.repository;

import com.smartfashion.entity.SellerRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRequestRepository extends JpaRepository<SellerRequest, Long> {
    
    Optional<SellerRequest> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @NonNull
    Page<SellerRequest> findAll(@NonNull Pageable pageable);
    
    @Query("SELECT sr FROM SellerRequest sr WHERE " +
           "LOWER(sr.shopName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(sr.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    @NonNull
    Page<SellerRequest> searchByShopNameOrEmail(@Param("searchTerm") String searchTerm, @NonNull Pageable pageable);
    
    long count();
}
