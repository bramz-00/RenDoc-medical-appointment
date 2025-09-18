package com.app.rendoc.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cabinets")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cabinet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String location;
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "cabinet")
    private List<Doctor> doctors;
}
