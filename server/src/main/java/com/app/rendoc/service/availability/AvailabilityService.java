package com.app.rendoc.service.availability;

import com.app.rendoc.model.Availability;
import com.app.rendoc.model.Doctor;
import com.app.rendoc.repository.availability.AvailabilityRepository;
import com.app.rendoc.repository.doctor.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AvailabilityService implements IAvailabilityService {
    private final AvailabilityRepository availabilityRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public Availability addAvailability(Long userId, Availability availability) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for user: " + userId));
        availability.setDoctor(doctor);
        return availabilityRepository.save(availability);
    }

    @Override
    public List<Availability> getAvailabilityByDoctor(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return availabilityRepository.findByDoctorId(doctor.getId());
    }

    @Override
    public void deleteAvailability(Long availabilityId) {
        availabilityRepository.deleteById(availabilityId);
    }

    @Override
    public List<Availability> getAvailableSlotsByDoctor(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return availabilityRepository.findByDoctorIdAndIsBookedFalse(doctor.getId());
    }
}
