package com.smartfashion.dto;

import com.smartfashion.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String accessToken;
    
    private String refreshToken;
    
    private Long expiresIn;
    
    private UserDto user;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String profilePictureUrl;
        private String role;
        private String bodyType;
        private String skinTone;
        private String stylePreference;
        
        public static UserDto fromUser(User user) {
            return UserDto.builder()
                    .id(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .profilePictureUrl(user.getProfilePictureUrl())
                    .role(user.getRole().toString())
                    .bodyType(user.getBodyType())
                    .skinTone(user.getSkinTone())
                    .stylePreference(user.getStylePreference())
                    .build();
        }
    }
}
