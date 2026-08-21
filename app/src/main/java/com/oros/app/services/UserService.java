package com.oros.app.services;

import com.oros.app.exception.UserNotFoundException;
import com.oros.app.model.User;
import com.oros.app.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Create User
    public User createUser(User user) {
        if (user.getPassword() != null && !user.getPassword().startsWith("$2")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }
    //get by id
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
    }
    // Get User by Username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
    }

    //get by id
    public Optional<User> getUserById(Long id) {
        Optional<User> u=userRepository.findById(id);
        if (u == null) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        return u;
    }

    //grt all
    public List<User> getAll(){
        return userRepository.findAll();
    }
    
}