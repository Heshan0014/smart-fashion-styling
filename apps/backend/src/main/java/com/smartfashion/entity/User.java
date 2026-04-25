package com.smartfashion.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email", unique = true),
    @Index(name = "idx_username", columnList = "username", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Column(nullable = false, unique = true)
    private String username;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;
    
    private String firstName;
    
    private String lastName;
    
    @Column(nullable = false)
    @Default
    private Boolean enabled = true;
    
    @Column(nullable = false)
    @Default
    private Boolean accountNonLocked = true;
    
    @Column(nullable = false)
    @Default
    private Boolean accountNonExpired = true;
    
    @Column(nullable = false)
    @Default
    private Boolean credentialsNonExpired = true;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Default
    private Role role = Role.CUSTOMER;
    
    private String profilePictureUrl;
    
    @Column(name = "style_preference", nullable = true)
    private String stylePreference; // JSON or enum for fashion preferences
    
    @Column(name = "body_type", nullable = true)
    private String bodyType; // For fashion recommendations
    
    @Column(name = "skin_tone", nullable = true)
    private String skinTone; // For color recommendations
    
    // Measurement fields
    @Column(name = "height", nullable = true)
    private Double height; // in cm
    
    @Column(name = "weight", nullable = true)
    private Double weight; // in kg
    
    @Column(name = "chest", nullable = true)
    private Double chest; // in cm
    
    @Column(name = "waist", nullable = true)
    private Double waist; // in cm
    
    @Column(name = "hip", nullable = true)
    private Double hip; // in cm
    
    @Column(name = "sleeve_length", nullable = true)
    private Double sleeveLength; // in cm
    
    @Column(name = "inseam", nullable = true)
    private Double inseam; // in cm for pants
    
    @Column(nullable = false, updatable = false)
    @Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    private LocalDateTime lastLogin;
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return this.accountNonExpired;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return this.accountNonLocked;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialsNonExpired;
    }
    
    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
    
    public enum Role {
        CUSTOMER,
        ADMIN,
        STYLIST
    }
}
