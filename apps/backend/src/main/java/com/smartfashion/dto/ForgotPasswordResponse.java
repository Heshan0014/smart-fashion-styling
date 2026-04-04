package com.smartfashion.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForgotPasswordResponse {
    
    private boolean success;
    private String message;
    private String resetToken; // Only for local testing; don't send in production emails
}
