package com.app.rendoc.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne @JoinColumn(name = "speciality_id", nullable = false)
    private Speciality speciality;
    @ManyToOne @JoinColumn(name = "cabinet_id", nullable = false)
    private Cabinet cabinet;


    private String status;
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonIgnore
    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;

    @JsonIgnore
    @OneToMany(mappedBy = "doctor")
    private List<Availability> availabilities;

}
