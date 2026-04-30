package com.app.rendoc.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @JsonIgnore
    @OneToMany(mappedBy = "availability", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;
}