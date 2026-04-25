package com.smartfashion.service;

import com.smartfashion.dto.AuthRequest;
import com.smartfashion.dto.AuthResponse;
import com.smartfashion.dto.SignUpRequest;
import com.smartfashion.entity.User;
import com.smartfashion.exception.ResourceAlreadyExistsException;
import com.smartfashion.exception.ResourceNotFoundException;
import com.smartfashion.repository.SellerRepository;
import com.smartfashion.repository.SellerRequestRepository;
import com.smartfashion.repository.UserRepository;
import com.smartfashion.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthService {
    
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final SellerRequestRepository sellerRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Transactional
    public AuthResponse signup(SignUpRequest signUpRequest) {
        // Check if user already exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already registered");
        }
        
        // Generate unique username from email (part before @)
        String generatedUsername = signUpRequest.getEmail().split("@")[0];
        int counter = 1;
        while (userRepository.existsByUsername(generatedUsername)) {
            generatedUsername = signUpRequest.getEmail().split("@")[0] + counter;
            counter++;
        }
        
        // Create new user
        User user = User.builder()
                .username(generatedUsername)
                .email(signUpRequest.getEmail())
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role(User.Role.CUSTOMER)
                .enabled(true)
                .accountNonLocked(true)
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        User savedUser = userRepository.save(user);
        
        // Generate tokens
        String accessToken = jwtTokenProvider.generateTokenFromUsername(savedUser.getUsername());
        String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser.getUsername());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getExpirationTime() / 1000) // Convert to seconds
                .user(AuthResponse.UserDto.fromUser(savedUser))
                .build();
    }
    
    public AuthResponse login(AuthRequest loginRequest) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Get user and update last login
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate tokens
        String accessToken = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getExpirationTime() / 1000)
                .user(AuthResponse.UserDto.fromUser(user))
                .build();
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String newAccessToken = jwtTokenProvider.generateTokenFromUsername(username);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(username);
        
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(jwtTokenProvider.getExpirationTime() / 1000)
                .user(AuthResponse.UserDto.fromUser(user))
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Update only non-null fields
        if (updatedUser.getFirstName() != null) {
            user.setFirstName(updatedUser.getFirstName());
        }
        if (updatedUser.getLastName() != null) {
            user.setLastName(updatedUser.getLastName());
        }
        if (updatedUser.getBodyType() != null) {
            user.setBodyType(updatedUser.getBodyType());
        }
        if (updatedUser.getSkinTone() != null) {
            user.setSkinTone(updatedUser.getSkinTone());
        }
        if (updatedUser.getStylePreference() != null) {
            user.setStylePreference(updatedUser.getStylePreference());
        }
        
        // Update measurement fields
        if (updatedUser.getHeight() != null) {
            user.setHeight(updatedUser.getHeight());
        }
        if (updatedUser.getWeight() != null) {
            user.setWeight(updatedUser.getWeight());
        }
        if (updatedUser.getChest() != null) {
            user.setChest(updatedUser.getChest());
        }
        if (updatedUser.getWaist() != null) {
            user.setWaist(updatedUser.getWaist());
        }
        if (updatedUser.getHip() != null) {
            user.setHip(updatedUser.getHip());
        }
        if (updatedUser.getSleeveLength() != null) {
            user.setSleeveLength(updatedUser.getSleeveLength());
        }
        if (updatedUser.getInseam() != null) {
            user.setInseam(updatedUser.getInseam());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public Map<String, Object> checkIfEmailIsSeller(String email) {
        Map<String, Object> response = new HashMap<>();
        
        // Check if email exists as an approved seller
        boolean isApprovedSeller = sellerRepository.existsByEmail(email);
        response.put("isApprovedSeller", isApprovedSeller);
        
        // Check if email exists as a seller request (pending approval)
        boolean isPendingSellerRequest = sellerRequestRepository.existsByEmail(email);
        response.put("isPendingSellerRequest", isPendingSellerRequest);
        
        response.put("isSeller", isApprovedSeller || isPendingSellerRequest);
        
        return response;
    }
}
