package com.smartfashion.controller;

import com.smartfashion.entity.Seller;
import com.smartfashion.entity.SellerRequest;
import com.smartfashion.service.SellerService;
import com.smartfashion.service.SellerRequestService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/v1/sellers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SellerController {
    
    @Autowired
    private SellerService sellerService;
    
    @Autowired
    private SellerRequestService sellerRequestService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Seller login - only for approved sellers in sellers table
     * POST /v1/sellers/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> sellerLogin(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createError("Email and password are required"));
            }
            
            Optional<Seller> seller = sellerService.getSellerByEmail(email);
            
            if (seller.isEmpty()) {
                log.warn("Seller login attempt - seller not found with email: {}", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createError("Seller not found"));
            }
            
            Seller foundSeller = seller.get();
            
            // Debug: Log password info
            log.debug("Login attempt for email: {}", email);
            log.debug("Stored password hash length: {}", foundSeller.getPassword() != null ? foundSeller.getPassword().length() : "NULL");
            log.debug("Input password length: {}", password.length());
            
            // Verify password
            if (foundSeller.getPassword() == null || foundSeller.getPassword().isEmpty()) {
                log.error("Seller password is empty/null for email: {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createError("Invalid credentials - seller password not set"));
            }
            
            if (!passwordEncoder.matches(password, foundSeller.getPassword())) {
                log.warn("Password mismatch for seller email: {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createError("Invalid email or password"));
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("data", foundSeller);
            log.info("Seller logged in with email: {}", email);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error during seller login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createError("Login failed: " + e.getMessage()));
        }
    }
    
    /**
     * Submit new seller registration request
     * POST /v1/sellers
     */
    @PostMapping
    public ResponseEntity<?> submitSellerRequest(@RequestBody SellerRequest sellerRequest) {
        try {
            SellerRequest savedRequest = sellerRequestService.submitSellerRequest(sellerRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Seller registration submitted successfully");
            response.put("data", savedRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createError(e.getMessage()));
        } catch (Exception e) {
            log.error("Error submitting seller request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createError("Failed to submit registration"));
        }
    }
    
    /**
     * Get all pending seller requests (for admin dashboard)
     * GET /v1/sellers
     */
    @GetMapping
    public ResponseEntity<?> getPendingRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<SellerRequest> requests;
            
            if (search != null && !search.isEmpty()) {
                requests = sellerRequestService.searchRequests(search, pageable);
            } else {
                requests = sellerRequestService.getAllRequests(pageable);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("data", requests.getContent());
            response.put("page", page);
            response.put("size", size);
            response.put("totalElements", requests.getTotalElements());
            response.put("totalPages", requests.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching seller requests", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createError("Failed to fetch requests"));
        }
    }
    
    /**
     * Get stats (pending requests and approved sellers)
     * GET /v1/sellers/stats/overview
     */
    @GetMapping("/stats/overview")
    public ResponseEntity<?> getStats() {
        try {
            long pendingCount = sellerRequestService.getTotalRequests();
            long approvedCount = sellerService.getTotalSellers();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("pending", pendingCount);
            stats.put("approved", approvedCount);
            stats.put("total", pendingCount + approvedCount);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createError("Failed to fetch statistics"));
        }
    }
    
    /**
     * Approve a seller request - moves from seller_requests to sellers table
     * PATCH /v1/sellers/{id}/approve
     */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveSeller(@PathVariable Long id) {
        try {
            Seller approvedSeller = sellerRequestService.approveSeller(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Seller approved successfully");
            response.put("data", approvedSeller);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createError(e.getMessage()));
        } catch (Exception e) {
            log.error("Error approving seller", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createError("Failed to approve seller"));
        }
    }
    
    /**
     * Reject a seller request - delete from seller_requests table
     * DELETE /v1/sellers/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> rejectSeller(@PathVariable Long id) {
        try {
            sellerRequestService.rejectSeller(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Seller request rejected and deleted");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createError(e.getMessage()));
        } catch (Exception e) {
            log.error("Error rejecting seller", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createError("Failed to reject seller"));
        }
    }
    
    /**
     * Admin endpoint to reset seller password
     * PATCH /v1/sellers/{id}/reset-password
     */
    @PatchMapping("/{id}/reset-password")
    public ResponseEntity<?> resetSellerPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newPassword = request.get("password");
            
            if (newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createError("New password is required"));
            }
            
            Optional<Seller> seller = sellerService.getSellerById(id);
            if (seller.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createError("Seller not found"));
            }
            
            Seller existingSeller = seller.get();
            // Encode the new password
            String encodedPassword = passwordEncoder.encode(newPassword);
            existingSeller.setPassword(encodedPassword);
            
            Seller updatedSeller = sellerService.updateSeller(existingSeller);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Seller password reset successfully");
            response.put("data", updatedSeller);
            log.info("Admin reset password for seller email: {}", existingSeller.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error resetting seller password", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createError("Failed to reset password"));
        }
    }
    
    /**
     * Helper method to create error response
     */
    private Map<String, String> createError(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
