package com.app.rendoc.controller;

import com.app.rendoc.model.Cabinet;
import com.app.rendoc.repository.cabinet.CabinetRepository;
import com.app.rendoc.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/cabinets")
@RequiredArgsConstructor
public class CabinetController {

    private final CabinetRepository cabinetRepository;

    @GetMapping
    public ResponseEntity<ApiResponse> getAll() {
        List<Cabinet> list = cabinetRepository.findAll();
        return ResponseEntity.ok(new ApiResponse("Cabinets retrieved", list));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> create(@RequestBody Cabinet cabinet) {
        Cabinet saved = cabinetRepository.save(cabinet);
        return ResponseEntity.ok(new ApiResponse("Cabinet created", saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse> update(@PathVariable Long id, @RequestBody Cabinet request) {
        return cabinetRepository.findById(id).map(c -> {
            c.setName(request.getName());
            c.setLocation(request.getLocation());
            return ResponseEntity.ok(new ApiResponse("Cabinet updated", cabinetRepository.save(c)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> delete(@PathVariable Long id) {
        cabinetRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("Cabinet deleted", null));
    }
}
