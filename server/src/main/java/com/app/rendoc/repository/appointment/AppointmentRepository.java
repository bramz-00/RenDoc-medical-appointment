package com.app.rendoc.repository.appointment;

import com.app.rendoc.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    long countByDoctorId(Long doctorId);
    long countByPatientId(Long patientId);
    long countByStatus(Appointment.Status status);
    
    List<Appointment> findTop5ByOrderByAppointmentDateDesc();
    List<Appointment> findTop5ByDoctorIdOrderByAppointmentDateDesc(Long doctorId);
    List<Appointment> findTop5ByPatientIdOrderByAppointmentDateDesc(Long patientId);
}
