package com.smartfashion.service;

import com.smartfashion.entity.Seller;
import com.smartfashion.repository.SellerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@Transactional
@SuppressWarnings("null")
public class SellerService {
    
    @Autowired
    private SellerRepository sellerRepository;
    
    /**
     * Get seller by email (only approved sellers)
     */
    @Transactional(readOnly = true)
    public Optional<Seller> getSellerByEmail(String email) {
        return sellerRepository.findByEmail(email);
    }
    
    /**
     * Get seller by ID (only approved sellers)
     */
    @Transactional(readOnly = true)
    public Optional<Seller> getSellerById(Long id) {
        return sellerRepository.findById(id);
    }
    
    /**
     * Get all approved sellers with pagination
     */
    @Transactional(readOnly = true)
    public Page<Seller> getAllSellers(Pageable pageable) {
        return sellerRepository.findAll(pageable);
    }
    
    /**
     * Search approved sellers by shop name or email
     */
    @Transactional(readOnly = true)
    public Page<Seller> searchSellers(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return sellerRepository.findAll(pageable);
        }
        return sellerRepository.searchByShopNameOrEmail(searchTerm, pageable);
    }
    
    /**
     * Get total count of approved sellers
     */
    @Transactional(readOnly = true)
    public long getTotalSellers() {
        return sellerRepository.count();
    }
    
    /**
     * Update seller information
     */
    public Seller updateSeller(Seller seller) {
        return sellerRepository.save(seller);
    }
}
