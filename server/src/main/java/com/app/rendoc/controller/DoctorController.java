package com.app.rendoc.controller;

import com.app.rendoc.model.*;
import com.app.rendoc.repository.cabinet.CabinetRepository;
import com.app.rendoc.repository.doctor.DoctorRepository;
import com.app.rendoc.repository.speciality.SpecialityRepository;
import com.app.rendoc.repository.user.UserRepository;
import com.app.rendoc.response.ApiResponse;
import com.app.rendoc.service.doctor.IDoctorService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final IDoctorService doctorService;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SpecialityRepository specialityRepository;
    private final CabinetRepository cabinetRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(new ApiResponse("Doctors retrieved", doctors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getById(@PathVariable Long id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(new ApiResponse("Doctor found", doctor));
    }

    /** Doctor fetches their own profile by userId */
    @GetMapping("/my-profile")
    public ResponseEntity<ApiResponse> getMyProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        return doctorRepository.findByUserId(currentUser.getId())
                .map(d -> ResponseEntity.ok(new ApiResponse("Profile found", d)))
                .orElse(ResponseEntity.notFound().build());
    }

    /** Doctor updates their own cabinet */
    @PutMapping("/my-cabinet")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse> updateMyCabinet(@RequestBody CabinetUpdateRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        return doctorRepository.findByUserId(currentUser.getId()).map(doctor -> {
            Cabinet cabinet = doctor.getCabinet();
            if (cabinet == null) {
                cabinet = new Cabinet();
            }
            cabinet.setName(req.getName());
            cabinet.setLocation(req.getLocation());
            Cabinet saved = cabinetRepository.save(cabinet);
            doctor.setCabinet(saved);
            doctorRepository.save(doctor);
            return ResponseEntity.ok(new ApiResponse("Cabinet updated", saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Admin: create a full doctor with user account */
    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> adminCreateDoctor(@RequestBody CreateDoctorRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Email already in use", null));
        }
        User user = new User();
        user.setFirstname(req.getFirstname());
        user.setLastname(req.getLastname());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.DOCTOR);
        userRepository.save(user);

        Speciality speciality = specialityRepository.findById(req.getSpecialityId())
                .orElseThrow(() -> new RuntimeException("Speciality not found"));
        Cabinet cabinet = cabinetRepository.findById(req.getCabinetId())
                .orElseThrow(() -> new RuntimeException("Cabinet not found"));

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpeciality(speciality);
        doctor.setCabinet(cabinet);
        doctor.setStatus("ACTIVE");
        doctorRepository.save(doctor);
        return ResponseEntity.ok(new ApiResponse("Doctor created", doctor));
    }

    /** Admin: update doctor info */
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> adminUpdateDoctor(@PathVariable Long id, @RequestBody UpdateDoctorRequest req) {
        return doctorRepository.findById(id).map(doctor -> {
            if (req.getSpecialityId() != null) {
                specialityRepository.findById(req.getSpecialityId()).ifPresent(doctor::setSpeciality);
            }
            if (req.getCabinetId() != null) {
                cabinetRepository.findById(req.getCabinetId()).ifPresent(doctor::setCabinet);
            }
            if (req.getStatus() != null) {
                doctor.setStatus(req.getStatus());
            }
            User u = doctor.getUser();
            if (req.getFirstname() != null) u.setFirstname(req.getFirstname());
            if (req.getLastname() != null) u.setLastname(req.getLastname());
            userRepository.save(u);
            return ResponseEntity.ok(new ApiResponse("Doctor updated", doctorRepository.save(doctor)));
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Admin: delete doctor */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> adminDeleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("Doctor deleted", null));
    }

    // --- Inner request DTOs ---
    @Data
    public static class CreateDoctorRequest {
        private String firstname, lastname, email, password;
        private Long specialityId, cabinetId;
    }

    @Data
    public static class UpdateDoctorRequest {
        private String firstname, lastname, status;
        private Long specialityId, cabinetId;
    }

    @Data
    public static class CabinetUpdateRequest {
        private String name, location;
    }
}

