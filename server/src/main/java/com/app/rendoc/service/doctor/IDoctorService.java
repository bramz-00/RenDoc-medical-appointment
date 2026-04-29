package com.app.rendoc.service.doctor;

import com.app.rendoc.model.Doctor;
import java.util.List;

public interface IDoctorService {
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(Long id);
}
