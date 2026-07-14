package com.oros.app.services;

import com.oros.app.dto.AuthRequest;
import com.oros.app.dto.AuthResponse;
import com.oros.app.dto.RegisterRequest;
import com.oros.app.model.Role;
import com.oros.app.model.User;
import com.oros.app.repository.UserRepository;
import com.oros.app.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        Role role = Role.CUSTOMER;
        try { role = Role.valueOf(req.getRole().toUpperCase()); } catch (Exception ignored) {}

        User u = new User(req.getUsername(), passwordEncoder.encode(req.getPassword()), role);
        userRepository.save(u);
        String token = jwtUtil.generateToken(new org.springframework.security.core.userdetails.User(u.getUsername(), u.getPassword(), java.util.List.of()));
        return new AuthResponse(token);
    }

    public AuthResponse login(AuthRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        org.springframework.security.core.userdetails.User userDetails =
                (org.springframework.security.core.userdetails.User) org.springframework.security.core.userdetails.User
                        .withUsername(req.getUsername()).password("").authorities(java.util.List.of()).build();

        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token);
    }
}
