package com.app.rendoc.service.doctor;

import com.app.rendoc.model.Doctor;
import com.app.rendoc.request.doctor.AddDoctorRequest;
import com.app.rendoc.request.doctor.UpdateDoctorRequest;


import java.util.List;

public interface IDoctorService {


    Doctor addDoctor(AddDoctorRequest doctor);
    Doctor getDoctorById(Long id);
    void deleteDoctorById(Long id);
    Doctor updateDoctor(UpdateDoctorRequest doctor, Long doctorId);
    List<Doctor> getAllDoctors();

    List<Doctor> getDoctorsBySpeciality(String speciality);
    Long countDoctorsBySpeciality(String speciality);


}
