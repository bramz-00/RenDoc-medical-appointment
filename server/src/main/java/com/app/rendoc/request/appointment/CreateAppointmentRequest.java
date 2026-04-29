package com.app.rendoc.request.appointment;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateAppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private Long availabilityId;
    private String notes;
}
