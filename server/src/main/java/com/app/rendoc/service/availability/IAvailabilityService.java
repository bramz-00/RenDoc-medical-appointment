package com.app.rendoc.service.availability;

import com.app.rendoc.model.Availability;
import java.util.List;

public interface IAvailabilityService {
    Availability addAvailability(Long doctorId, Availability availability);
    List<Availability> getAvailabilityByDoctor(Long doctorId);
    void deleteAvailability(Long availabilityId);
    List<Availability> getAvailableSlotsByDoctor(Long doctorId);
}
