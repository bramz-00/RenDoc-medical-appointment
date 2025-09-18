package com.app.rendoc.service.speciality;

import com.app.rendoc.model.Speciality;
import com.app.rendoc.request.speciality.AddSpecialityRequest;
import com.app.rendoc.request.speciality.UpdateSpecialityRequest;

import java.util.List;

public interface ISpecialityService {


    Speciality addSpeciality(AddSpecialityRequest speciality);
    Speciality getSpecialityById(Long id);
    void deleteSpecialityById(Long id);
    Speciality updateSpeciality(UpdateSpecialityRequest speciality, Long specialityId);
    List<Speciality> getAllSpecialities();
}
