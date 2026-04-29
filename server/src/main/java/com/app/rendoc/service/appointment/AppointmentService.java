package com.app.rendoc.service.appointment;

import com.app.rendoc.exceptions.ResourceNotFoundException;
import com.app.rendoc.model.Appointment;
import com.app.rendoc.model.Availability;
import com.app.rendoc.model.Doctor;
import com.app.rendoc.model.Patient;
import com.app.rendoc.repository.appointment.AppointmentRepository;
import com.app.rendoc.repository.availability.AvailabilityRepository;
import com.app.rendoc.repository.doctor.DoctorRepository;
import com.app.rendoc.repository.patient.PatientRepository;
import com.app.rendoc.request.appointment.CreateAppointmentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService implements IAppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AvailabilityRepository availabilityRepository;
    private final com.app.rendoc.repository.user.UserRepository userRepository;

    @Override
    public Appointment createAppointment(CreateAppointmentRequest request) {
        // Resolve Patient from User ID (request.getPatientId is user.id from frontend)
        Patient patient = patientRepository.findByUserId(request.getPatientId())
                .orElseGet(() -> {
                    com.app.rendoc.model.User user = userRepository.findById(request.getPatientId())
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    Patient p = new Patient();
                    p.setUser(user);
                    p.setStatus("ACTIVE");
                    return patientRepository.save(p);
                });
        
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        
        Availability availability = availabilityRepository.findById(request.getAvailabilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found"));

        availability.setBooked(true);
        availabilityRepository.save(availability);

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAvailability(availability);
        appointment.setNotes(request.getNotes());
        appointment.setAppointmentDate(availability.getStartTime());
        appointment.setStatus(Appointment.Status.PENDING);

        return appointmentRepository.save(appointment);
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    @Override
    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        // patientId here is actually the userId from the frontend
        return patientRepository.findByUserId(patientId)
                .map(patient -> appointmentRepository.findByPatientId(patient.getId()))
                .orElse(List.of());
    }

    @Override
    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @Override
    public void cancelAppointment(Long id) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(Appointment.Status.CANCELLED);
        
        Availability availability = appointment.getAvailability();
        if (availability != null) {
            availability.setBooked(false);
            availabilityRepository.save(availability);
        }

        appointmentRepository.save(appointment);
    }
}
