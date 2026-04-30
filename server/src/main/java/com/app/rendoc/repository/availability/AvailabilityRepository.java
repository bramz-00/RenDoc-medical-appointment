package com.app.rendoc.repository.availability;

import com.app.rendoc.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByDoctorId(Long doctorId);
    List<Availability> findByDoctorIdAndIsBookedFalse(Long doctorId);
    List<Availability> findByDoctorIdAndIsBookedFalseAndStartTimeAfter(Long doctorId, java.time.LocalDateTime startTime);
}
