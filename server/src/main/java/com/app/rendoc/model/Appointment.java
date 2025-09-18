package com.app.rendoc.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    @ManyToOne @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
    @ManyToOne
    @JoinColumn(name = "availability_id", nullable = false)
    private Availability availability;
    private LocalDateTime appointmentDate;

    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    private String notes;

    public enum Status {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
}
