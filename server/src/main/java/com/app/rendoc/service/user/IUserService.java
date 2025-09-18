package com.app.rendoc.service.user;

import com.app.rendoc.model.User;
import com.app.rendoc.request.user.AddUserRequest;
import com.app.rendoc.request.user.UpdateUserRequest;

import java.util.List;

public interface IUserService {


    User addUser(AddUserRequest user);
    User getUserById(Long id);
    void deleteUserById(Long id);
    User updateUser(UpdateUserRequest user, Long userId);
    List<User> getAllUsers();
}
