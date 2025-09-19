package com.app.rendoc.service.speciality;

import com.app.rendoc.exceptions.ResourceNotFoundException;
import com.app.rendoc.model.Speciality;
import com.app.rendoc.repository.speciality.SpecialityRepository;
import com.app.rendoc.request.speciality.AddSpecialityRequest;
import com.app.rendoc.request.speciality.UpdateSpecialityRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class SpecialityService implements  ISpecialityService{

    @Autowired
    private SpecialityRepository specialityRepository;
    @Override
    public Speciality addSpeciality(AddSpecialityRequest request) {

        return specialityRepository.save(createSpeciality(request));
    }
    private Speciality createSpeciality(AddSpecialityRequest request) {
        return new Speciality(
                request.getName()
        );
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
    public Speciality updateSpeciality(UpdateSpecialityRequest request, Long specialityId) {
        return specialityRepository.findById(specialityId)
                .map(existingSpeciality -> updateExistingSpeciality(existingSpeciality,request))
                .map(specialityRepository :: save)
                .orElseThrow(()-> new ResourceNotFoundException("Product not found!"));
    }


    private Speciality updateExistingSpeciality(Speciality existingSpeciality, UpdateSpecialityRequest request) {
        existingSpeciality.setName(request.getName());
        return  existingSpeciality;

    }

    @Override
    public List<Speciality> getAllSpecialities() {
        return  specialityRepository.findAll();
    }
}
