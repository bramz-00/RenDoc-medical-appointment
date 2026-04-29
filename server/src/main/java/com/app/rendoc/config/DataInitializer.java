package com.app.rendoc.config;

import com.app.rendoc.model.*;
import com.app.rendoc.repository.cabinet.CabinetRepository;
import com.app.rendoc.repository.doctor.DoctorRepository;
import com.app.rendoc.repository.speciality.SpecialityRepository;
import com.app.rendoc.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final SpecialityRepository specialityRepository;
    private final CabinetRepository cabinetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Create ADMIN if not exists
        if (!userRepository.existsByEmail("admin@rendoc.com")) {
            User admin = new User();
            admin.setFirstname("System");
            admin.setLastname("Admin");
            admin.setEmail("admin@rendoc.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✓ Admin user created: admin@rendoc.com / admin123");
        }

        // 2. Create DOCTOR if not exists
        if (!userRepository.existsByEmail("doctor@rendoc.com")) {
            // Seed dependency: Speciality
            Speciality cardio = new Speciality();
            cardio.setName("Cardiology");
            cardio = specialityRepository.save(cardio);

            // Seed dependency: Cabinet
            Cabinet clinic = new Cabinet();
            clinic.setName("Central Medical Center");
            clinic.setLocation("123 Health St");
            clinic = cabinetRepository.save(clinic);

            // User account for Doctor
            User doctorUser = new User();
            doctorUser.setFirstname("John");
            doctorUser.setLastname("Doe");
            doctorUser.setEmail("doctor@rendoc.com");
            doctorUser.setPassword(passwordEncoder.encode("doctor123"));
            doctorUser.setRole(User.Role.DOCTOR);
            userRepository.save(doctorUser);

            // Doctor profile
            Doctor doctor = new Doctor();
            doctor.setUser(doctorUser);
            doctor.setSpeciality(cardio);
            doctor.setCabinet(clinic);
            doctor.setStatus("ACTIVE");
            doctorRepository.save(doctor);

            System.out.println("✓ Doctor user created: doctor@rendoc.com / doctor123");
        }
    }
}
