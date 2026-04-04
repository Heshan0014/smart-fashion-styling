package com.smartfashion.repository;

import com.smartfashion.entity.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {
    
    Optional<Seller> findByEmail(String email);
    
    @Query("SELECT s FROM Seller s WHERE LOWER(s.shopName) LIKE LOWER(CONCAT('%', :shopName, '%'))")
    Page<Seller> findByShopNameContainingIgnoreCase(@Param("shopName") String shopName, Pageable pageable);
    
    @Query("SELECT s FROM Seller s WHERE " +
           "LOWER(s.shopName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Seller> searchByShopNameOrEmail(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    boolean existsByEmail(String email);
    
    long count();
}
