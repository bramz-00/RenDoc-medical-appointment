package com.app.rendoc.response.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private Long id;
    private String email;
    private String firstname;
    private String lastname;
    private String role;
    private boolean isAuthenticated;
}