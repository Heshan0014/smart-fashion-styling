package com.smartfashion.dto;

import com.smartfashion.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for returning user data to admin panel
 * Excludes password for security
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String profilePictureUrl;
    
    // Style and body preferences
    private String stylePreference;
    private String bodyType;
    private String skinTone;
    
    // Measurements
    private Double height;
    private Double weight;
    private Double chest;
    private Double waist;
    private Double hip;
    private Double sleeveLength;
    private Double inseam;
    
    // Account status
    private Boolean enabled;
    private Boolean accountNonLocked;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    
    /**
     * Convert User entity to UserAdminDto
     */
    public static UserAdminDto fromEntity(User user) {
        return UserAdminDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().toString())
                .profilePictureUrl(user.getProfilePictureUrl())
                .stylePreference(user.getStylePreference())
                .bodyType(user.getBodyType())
                .skinTone(user.getSkinTone())
                .height(user.getHeight())
                .weight(user.getWeight())
                .chest(user.getChest())
                .waist(user.getWaist())
                .hip(user.getHip())
                .sleeveLength(user.getSleeveLength())
                .inseam(user.getInseam())
                .enabled(user.getEnabled())
                .accountNonLocked(user.getAccountNonLocked())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
