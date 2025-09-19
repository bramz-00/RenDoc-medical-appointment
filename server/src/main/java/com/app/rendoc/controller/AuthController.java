package com.app.rendoc.controller;


import com.app.rendoc.request.auth.LoginRequest;
import com.app.rendoc.request.auth.RegisterRequest;
import com.app.rendoc.response.ApiResponse;
import com.app.rendoc.response.auth.AuthResponse;
import com.app.rendoc.response.auth.MessageResponse;
import com.app.rendoc.service.auth.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    private final IAuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse authResponse = authService.register(request);
            return ResponseEntity.ok(new ApiResponse("User registered successfully!", authResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Registration failed: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error: " + e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse authResponse = authService.login(request);
            return ResponseEntity.ok(new ApiResponse("Login successful!", authResponse));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Login failed: " + e.getMessage(), null));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        try {
            MessageResponse response = authService.logout();
            return ResponseEntity.ok(new ApiResponse(response.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error: " + e.getMessage(), null));
        }
    }
}
