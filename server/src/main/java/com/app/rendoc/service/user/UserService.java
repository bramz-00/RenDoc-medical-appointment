package com.app.rendoc.service.user;

import com.app.rendoc.exceptions.ResourceNotFoundException;
import com.app.rendoc.model.User;
import com.app.rendoc.repository.user.UserRepository;
import com.app.rendoc.request.user.AddUserRequest;
import com.app.rendoc.request.user.UpdateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User addUser(AddUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Override
    public void deleteUserById(Long id) {
        userRepository.findById(id).ifPresentOrElse(userRepository::delete, () -> {
            throw new ResourceNotFoundException("User not found!");
        });
    }

    @Override
    public User updateUser(UpdateUserRequest request, Long userId) {
        return userRepository.findById(userId).map(existingUser -> {
            if (request.getFirstName() != null) existingUser.setFirstname(request.getFirstName());
            if (request.getLastName() != null) existingUser.setLastname(request.getLastName());
            if (request.getEmail() != null) existingUser.setEmail(request.getEmail());
            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            return userRepository.save(existingUser);
        }).orElseThrow(() -> new ResourceNotFoundException("User not found!"));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
