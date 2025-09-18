package com.app.rendoc.model;

import jakarta.persistence.*;
import lombok.*;

import javax.print.Doc;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "availabilities")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private boolean isBooked = false;

    @OneToMany(mappedBy = "availability")
    private List<Appointment> appointments;
}