package com.app.rendoc.service.auth;

import com.app.rendoc.request.auth.LoginRequest;
import com.app.rendoc.request.auth.RegisterRequest;
import com.app.rendoc.response.auth.AuthResponse;
import com.app.rendoc.response.auth.MessageResponse;
import com.app.rendoc.response.auth.UserInfoResponse;
import org.springframework.security.core.Authentication;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    MessageResponse logout(String token);
    UserInfoResponse getCurrentUserInfo(Authentication authentication);

}
