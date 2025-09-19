package com.app.rendoc.controller;

import com.app.rendoc.model.Speciality;
import com.app.rendoc.response.ApiResponse;
import com.app.rendoc.service.speciality.ISpecialityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static org.springframework.http.HttpStatus.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/specialities")
public class SpecialityController {
    private final ISpecialityService specialityService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllSpecialities() {
        try {
            List<Speciality> categories = specialityService.getAllSpecialities();
            return  ResponseEntity.ok(new ApiResponse("Found!", categories));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error:", INTERNAL_SERVER_ERROR));
        }
    }

}
