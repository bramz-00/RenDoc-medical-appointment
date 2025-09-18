package com.app.rendoc.repository.speciality;

import com.app.rendoc.model.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpecialityRepository extends JpaRepository<Speciality, Long> {

    List<Speciality> findByName(String name);

}
