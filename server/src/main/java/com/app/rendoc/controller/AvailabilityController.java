package com.app.rendoc.controller;

import com.app.rendoc.model.Availability;
import com.app.rendoc.response.ApiResponse;
import com.app.rendoc.service.availability.IAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/availabilities")
@RequiredArgsConstructor
public class AvailabilityController {
    private final IAvailabilityService availabilityService;

    @PostMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addAvailability(@PathVariable Long doctorId, @RequestBody Availability availability) {
        try {
            Availability saved = availabilityService.addAvailability(doctorId, availability);
            return ResponseEntity.ok(new ApiResponse("Availability added!", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse> getByDoctor(@PathVariable Long doctorId) {
        List<Availability> list = availabilityService.getAvailabilityByDoctor(doctorId);
        return ResponseEntity.ok(new ApiResponse("Success", list));
    }

    @GetMapping("/doctor/{doctorId}/available")
    public ResponseEntity<ApiResponse> getAvailableByDoctor(@PathVariable Long doctorId) {
        List<Availability> list = availabilityService.getAvailableSlotsByDoctor(doctorId);
        return ResponseEntity.ok(new ApiResponse("Success", list));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.ok(new ApiResponse("Deleted", null));
    }

    @DeleteMapping("/bulk-delete")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> bulkDelete(@RequestBody List<Long> ids) {
        try {
            availabilityService.bulkDelete(ids);
            return ResponseEntity.ok(new ApiResponse("Availabilities deleted!", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), null));
        }
    }
}
