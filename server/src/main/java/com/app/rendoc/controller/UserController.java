package com.app.rendoc.controller;

import com.app.rendoc.model.Patient;
import com.app.rendoc.model.User;
import com.app.rendoc.repository.patient.PatientRepository;
import com.app.rendoc.repository.user.UserRepository;
import com.app.rendoc.request.user.UpdateUserRequest;
import com.app.rendoc.response.ApiResponse;
import com.app.rendoc.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    @PutMapping("/profile/update")
    public ResponseEntity<ApiResponse> updateProfile(@RequestBody UpdateUserRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() ||
                    "anonymousUser".equals(authentication.getPrincipal())) {
                return ResponseEntity.status(UNAUTHORIZED)
                        .body(new ApiResponse("User not authenticated", null));
            }
            User currentUser = (User) authentication.getPrincipal();
            User updatedUser = userService.updateUser(request, currentUser.getId());
            return ResponseEntity.ok(new ApiResponse("Profile updated successfully!", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error updating profile: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(new ApiResponse("User found!", user));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error: " + e.getMessage(), null));
        }
    }

    /** Admin: list all users */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(new ApiResponse("Users retrieved", users));
    }

    /** Admin: list all patients */
    @GetMapping("/admin/patients")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return ResponseEntity.ok(new ApiResponse("Patients retrieved", patients));
    }

    /** Admin: delete user */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("User deleted", null));
    }
}
