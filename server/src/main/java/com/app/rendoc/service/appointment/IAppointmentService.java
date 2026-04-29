package com.app.rendoc.service.appointment;

import com.app.rendoc.model.Appointment;
import com.app.rendoc.request.appointment.CreateAppointmentRequest;

import java.util.List;

public interface IAppointmentService {
    Appointment createAppointment(CreateAppointmentRequest request);
    Appointment getAppointmentById(Long id);
    List<Appointment> getAppointmentsByPatientId(Long patientId);
    List<Appointment> getAppointmentsByDoctorId(Long doctorId);
    void cancelAppointment(Long id);
}
