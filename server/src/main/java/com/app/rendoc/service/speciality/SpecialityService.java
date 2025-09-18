package com.app.rendoc.service.speciality;

import com.app.rendoc.exceptions.ResourceNotFoundException;
import com.app.rendoc.model.Speciality;
import com.app.rendoc.repository.speciality.SpecialityRepository;
import com.app.rendoc.request.speciality.AddSpecialityRequest;
import com.app.rendoc.request.speciality.UpdateSpecialityRequest;

import java.util.List;

public class SpecialityService implements  ISpecialityService{

    private SpecialityRepository specialityRepository;
    @Override
    public Speciality addSpeciality(AddSpecialityRequest speciality) {
        return null;
    }

    @Override
    public Speciality getSpecialityById(Long id) {
        return specialityRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Speciality not found!"));
    }

    @Override
    public void deleteSpecialityById(Long id) {
          specialityRepository.findById(id)
                 .ifPresentOrElse(specialityRepository::delete,
                         () -> {throw new ResourceNotFoundException("Speciality not found!");});

    }

    @Override
    public Speciality updateSpeciality(UpdateSpecialityRequest speciality, Long specialityId) {
        return null;
    }

    @Override
    public List<Speciality> getAllSpecialities() {
        return  specialityRepository.findAll();
    }
}
