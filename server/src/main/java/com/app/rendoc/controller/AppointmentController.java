package com.app.rendoc.controller;

import com.app.rendoc.model.Appointment;
import com.app.rendoc.request.appointment.CreateAppointmentRequest;
import com.app.rendoc.response.ApiResponse;
import com.app.rendoc.service.appointment.IAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("${api.prefix}/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final IAppointmentService appointmentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createAppointment(@RequestBody CreateAppointmentRequest request) {
        try {
            Appointment appointment = appointmentService.createAppointment(request);
            return ResponseEntity.ok(new ApiResponse("Appointment created successfully!", appointment));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error creating appointment: " + e.getMessage(), null));
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse> getAppointmentsByPatient(@PathVariable Long patientId) {
        try {
            List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
            return ResponseEntity.ok(new ApiResponse("Appointments found!", appointments));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error: " + e.getMessage(), null));
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse> cancelAppointment(@PathVariable Long id) {
        try {
            appointmentService.cancelAppointment(id);
            return ResponseEntity.ok(new ApiResponse("Appointment cancelled successfully!", null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Error: " + e.getMessage(), null));
        }
    }
}
