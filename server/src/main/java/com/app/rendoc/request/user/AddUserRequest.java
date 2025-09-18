package com.app.rendoc.request.user;
import lombok.Data;

@Data
public class AddUserRequest {


    private String firstName;
    private String lastName;
    private String email;
    private String password;


}