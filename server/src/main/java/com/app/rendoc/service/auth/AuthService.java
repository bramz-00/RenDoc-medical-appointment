package com.app.rendoc.service.auth;


import com.app.rendoc.config.JwtUtils;
import com.app.rendoc.exceptions.ResourceNotFoundException;
import com.app.rendoc.model.User;
import com.app.rendoc.repository.user.UserRepository;
import com.app.rendoc.request.auth.LoginRequest;
import com.app.rendoc.request.auth.RegisterRequest;
import com.app.rendoc.response.ApiResponse;
import com.app.rendoc.response.auth.AuthResponse;
import com.app.rendoc.response.auth.MessageResponse;
import com.app.rendoc.response.auth.UserInfoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService   implements IAuthService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());

        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtils.generateToken(savedUser.getEmail());

        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(),
                savedUser.getFirstname(), savedUser.getLastname(), savedUser.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Get user details
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        // Generate JWT token
        String token = jwtUtils.generateToken(userDetails);

        return new AuthResponse(token, user.getId(), user.getEmail(),
                user.getFirstname(), user.getLastname(), user.getRole());
    }


    public MessageResponse logout(String token) {
        if (token != null) {
            tokenBlacklistService.blacklistToken(token);
        }

        if (token != null && !tokenBlacklistService.isTokenBlacklisted(token)) {
            return new MessageResponse("Token is not blacklisted!");
        }
        return new MessageResponse("Logout successful!");
    }

    @Override
    public UserInfoResponse getCurrentUserInfo(Authentication authentication) {
        try {
            // Get the username/email from the authentication object
            String email = authentication.getName();

            // Find the user in the database
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

            // Return user information
            return new UserInfoResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getFirstname(),
                    user.getLastname(),
                    user.getRole().name(),
                    true
            );
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving user information: " + e.getMessage());
        }
    }
}
