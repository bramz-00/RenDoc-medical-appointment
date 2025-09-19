package com.app.rendoc.controller;

import com.app.rendoc.exceptions.AlreadyExistsException;
import com.app.rendoc.exceptions.ResourceNotFoundException;
import com.app.rendoc.model.Speciality;
import com.app.rendoc.request.speciality.AddSpecialityRequest;
import com.app.rendoc.request.speciality.UpdateSpecialityRequest;
import com.app.rendoc.response.ApiResponse;
import com.app.rendoc.service.speciality.ISpecialityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addSpeciality(@RequestBody AddSpecialityRequest request) {
        try {
            Speciality theSpeciality = specialityService.addSpeciality(request);
            return  ResponseEntity.ok(new ApiResponse("Success", theSpeciality));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/speciality/{id}/speciality")
    public ResponseEntity<ApiResponse> getSpecialityById(@PathVariable Long id){
        try {
            Speciality theSpeciality = specialityService.getSpecialityById(id);
            return  ResponseEntity.ok(new ApiResponse("Found", theSpeciality));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @DeleteMapping("/speciality/{id}/delete")
    public ResponseEntity<ApiResponse> deleteSpeciality(@PathVariable Long id){
        try {
            specialityService.deleteSpecialityById(id);
            return  ResponseEntity.ok(new ApiResponse("Found", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/speciality/{specialityId}/update")
    public  ResponseEntity<ApiResponse> updateSpeciality(@RequestBody UpdateSpecialityRequest request, @PathVariable Long specialityId) {
        try {
            Speciality theSpeciality = specialityService.updateSpeciality(request, specialityId);
            return ResponseEntity.ok(new ApiResponse("Update speciality success!", theSpeciality));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

}
