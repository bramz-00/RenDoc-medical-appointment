package com.app.rendoc.request.doctor;

import com.app.rendoc.model.Cabinet;
import com.app.rendoc.model.Speciality;
import com.app.rendoc.model.User;
import lombok.Data;

@Data
public class UpdateDoctorRequest {

    private User user;
    private Speciality speciality;
    private Cabinet cabinet;

}