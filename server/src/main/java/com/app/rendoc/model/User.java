package com.app.rendoc.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String avatar;
    private LocalDateTime createdAt = LocalDateTime.now();
    @OneToMany(mappedBy = "user")
    private List<Doctor> doctors;
    @OneToMany(mappedBy = "user")
    private List<Patient> patients;




}
