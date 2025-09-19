package com.app.rendoc.service.auth;

import com.app.rendoc.request.auth.LoginRequest;
import com.app.rendoc.request.auth.RegisterRequest;
import com.app.rendoc.response.auth.AuthResponse;
import com.app.rendoc.response.auth.MessageResponse;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    MessageResponse logout();
}
