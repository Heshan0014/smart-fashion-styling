package com.smartfashion.service;

import com.smartfashion.entity.Seller;
import com.smartfashion.entity.SellerRequest;
import com.smartfashion.repository.SellerRepository;
import com.smartfashion.repository.SellerRequestRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@SuppressWarnings("null")
public class SellerRequestService {
    
    @Autowired
    private SellerRequestRepository sellerRequestRepository;
    
    @Autowired
    private SellerRepository sellerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Create a new seller registration request (saved to seller_requests table)
     */
    public SellerRequest submitSellerRequest(SellerRequest sellerRequest) {
        // Check if email already exists in seller_requests
        if (sellerRequestRepository.findByEmail(sellerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already submitted");
        }
        
        // Check if email already exists in approved sellers
        if (sellerRepository.findByEmail(sellerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered as seller");
        }
        
        // Encode password before saving
        sellerRequest.setPassword(passwordEncoder.encode(sellerRequest.getPassword()));
        sellerRequest.setSubmittedAt(LocalDateTime.now());
        
        SellerRequest savedRequest = sellerRequestRepository.save(sellerRequest);
        log.info("New seller request submitted with email: {}", sellerRequest.getEmail());
        return savedRequest;
    }
    
    /**
     * Get all pending seller requests with pagination
     */
    @Transactional(readOnly = true)
    public Page<SellerRequest> getAllRequests(Pageable pageable) {
        return sellerRequestRepository.findAll(pageable);
    }
    
    /**
     * Search seller requests by shop name or email
     */
    @Transactional(readOnly = true)
    public Page<SellerRequest> searchRequests(String searchTerm, Pageable pageable) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return sellerRequestRepository.findAll(pageable);
        }
        return sellerRequestRepository.searchByShopNameOrEmail(searchTerm, pageable);
    }
    
    /**
     * Get seller request by ID
     */
    @Transactional(readOnly = true)
    public Optional<SellerRequest> getRequestById(Long id) {
        return sellerRequestRepository.findById(id);
    }
    
    /**
     * Approve a seller request - moves from seller_requests to sellers table
     */
    public Seller approveSeller(Long requestId) {
        SellerRequest request = sellerRequestRepository.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Seller request not found with id: " + requestId));
        
        // Verify password is encoded
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Seller password is not set");
        }
        
        if (!request.getPassword().startsWith("$2a$") && !request.getPassword().startsWith("$2b$")) {
            log.warn("Warning: Seller password may not be properly encoded for email: {}", request.getEmail());
            // Still proceed as the password might be plain text
        }
        
        // Create new approved seller
        Seller seller = Seller.builder()
            .shopName(request.getShopName())
            .shopDescription(request.getShopDescription())
            .category(request.getCategory())
            .businessType(request.getBusinessType())
            .email(request.getEmail())
            .phone(request.getPhone())
            .address(request.getAddress())
            .city(request.getCity())
            .state(request.getState())
            .zipCode(request.getZipCode())
            .bankAccountName(request.getBankAccountName())
            .bankAccountNumber(request.getBankAccountNumber())
            .bankIFSC(request.getBankIFSC())
            .averagePriceRange(request.getAveragePriceRange())
            .website(request.getWebsite())
            .instagram(request.getInstagram())
            .facebook(request.getFacebook())
            .twitter(request.getTwitter())
            .linkedin(request.getLinkedin())
            .password(request.getPassword())
            .approvedAt(LocalDateTime.now())
            .build();
        
        // Save to sellers table
        Seller approvedSeller = sellerRepository.save(seller);
        
        // Delete from seller_requests table
        sellerRequestRepository.delete(request);
        
        log.info("Seller request approved and moved to sellers table. Email: {}, ID: {}, Password hash length: {}", 
                 approvedSeller.getEmail(), approvedSeller.getId(), approvedSeller.getPassword().length());
        return approvedSeller;
    }
    
    /**
     * Reject a seller request - delete from seller_requests table
     */
    public void rejectSeller(Long requestId) {
        SellerRequest request = sellerRequestRepository.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Seller request not found with id: " + requestId));
        
        sellerRequestRepository.delete(request);
        log.info("Seller request rejected and deleted. Email: {}", request.getEmail());
    }
    
    /**
     * Get total count of pending requests
     */
    @Transactional(readOnly = true)
    public long getTotalRequests() {
        return sellerRequestRepository.count();
    }
}
