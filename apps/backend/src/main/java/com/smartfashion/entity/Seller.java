package com.smartfashion.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "sellers", indexes = {
    @Index(name = "idx_seller_email", columnList = "email"),
    @Index(name = "idx_seller_created_at", columnList = "created_at"),
    @Index(name = "idx_seller_shop_name", columnList = "shop_name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seller {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "shop_name", nullable = false)
    private String shopName;
    
    @Column(name = "shop_description", columnDefinition = "TEXT")
    private String shopDescription;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "business_type")
    private String businessType;
    
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "address")
    private String address;
    
    @Column(name = "city")
    private String city;
    
    @Column(name = "state")
    private String state;
    
    @Column(name = "zip_code")
    private String zipCode;
    
    @Column(name = "bank_account_name")
    private String bankAccountName;
    
    @Column(name = "bank_account_number")
    private String bankAccountNumber;
    
    @Column(name = "bank_ifsc")
    private String bankIFSC;
    
    @Column(name = "average_price_range")
    private String averagePriceRange;
    
    @Column(name = "website")
    private String website;
    
    @Column(name = "instagram")
    private String instagram;
    
    @Column(name = "facebook")
    private String facebook;
    
    @Column(name = "twitter")
    private String twitter;
    
    @Column(name = "linkedin")
    private String linkedin;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "approved_at", nullable = false)
    private LocalDateTime approvedAt;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (approvedAt == null) {
            approvedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
