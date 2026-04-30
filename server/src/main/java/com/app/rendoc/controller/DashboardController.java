package com.app.rendoc.controller;

import com.app.rendoc.model.*;
import com.app.rendoc.repository.appointment.AppointmentRepository;
import com.app.rendoc.repository.cabinet.CabinetRepository;
import com.app.rendoc.repository.doctor.DoctorRepository;
import com.app.rendoc.repository.patient.PatientRepository;
import com.app.rendoc.repository.user.UserRepository;
import com.app.rendoc.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final CabinetRepository cabinetRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        
        Map<String, Object> stats = new HashMap<>();
        
        if (currentUser.getRole() == User.Role.ADMIN) {
            stats.put("totalDoctors", doctorRepository.count());
            stats.put("totalPatients", patientRepository.count());
            stats.put("totalAppointments", appointmentRepository.count());
            stats.put("totalCabinets", cabinetRepository.count());
            stats.put("recentAppointments", appointmentRepository.findTop5ByOrderByAppointmentDateDesc());
        } else if (currentUser.getRole() == User.Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctor.getId());
            
            long todayCount = allAppointments.stream()
                    .filter(a -> a.getAppointmentDate().toLocalDate().equals(LocalDate.now()))
                    .count();
            
            long pendingCount = allAppointments.stream()
                    .filter(a -> a.getStatus() == Appointment.Status.PENDING)
                    .count();

            long confirmedCount = allAppointments.stream()
                    .filter(a -> a.getStatus() == Appointment.Status.CONFIRMED)
                    .count();
            
            long thisWeekCount = allAppointments.stream()
                    .filter(a -> a.getAppointmentDate().isAfter(LocalDateTime.now().minusDays(7)))
                    .count();
            
            stats.put("todayAppointments", todayCount);
            stats.put("pendingAppointments", pendingCount);
            stats.put("confirmedAppointments", confirmedCount);
            stats.put("thisWeekAppointments", thisWeekCount);
            stats.put("totalAppointments", allAppointments.size());
            
            long uniquePatients = allAppointments.stream()
                    .map(a -> a.getPatient().getId())
                    .distinct()
                    .count();
            stats.put("activeClients", uniquePatients);
            
            stats.put("upcomingAppointments", appointmentRepository.findTop5ByDoctorIdOrderByAppointmentDateDesc(doctor.getId()));
            
        } else if (currentUser.getRole() == User.Role.PATIENT) {
            Patient patient = patientRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
            
            List<Appointment> allAppointments = appointmentRepository.findByPatientId(patient.getId());
            
            long upcomingCount = allAppointments.stream()
                    .filter(a -> a.getAppointmentDate().isAfter(LocalDateTime.now()) && a.getStatus() != Appointment.Status.CANCELLED)
                    .count();
            
            long thisWeekCount = allAppointments.stream()
                    .filter(a -> a.getAppointmentDate().isAfter(LocalDateTime.now().minusDays(7)))
                    .count();

            stats.put("totalAppointments", allAppointments.size());
            stats.put("upcomingCount", upcomingCount);
            stats.put("thisWeekAppointments", thisWeekCount);
            
            long uniqueDoctors = allAppointments.stream()
                    .map(a -> a.getDoctor().getId())
                    .distinct()
                    .count();
            stats.put("totalDoctorsSeen", uniqueDoctors);
            
            stats.put("upcomingAppointments", appointmentRepository.findTop5ByPatientIdOrderByAppointmentDateDesc(patient.getId()));
        }
        
        return ResponseEntity.ok(new ApiResponse("Stats retrieved", stats));
    }
}
