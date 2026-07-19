package com.oros.app.services;

import com.oros.app.dto.AuthRequest;
import com.oros.app.dto.AuthResponse;
import com.oros.app.dto.RegisterRequest;
import com.oros.app.model.User;
import com.oros.app.model.enums.Role;
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
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest req) {
        Role role = Role.CUSTOMER;
        try {
            role = Role.valueOf(req.getRole().toUpperCase());
        } catch (Exception ignored) {
        }

        User u = new User(req.getUsername(), req.getEmail(), passwordEncoder.encode(req.getPassword()), role);
        userRepository.save(u);
        return new AuthResponse(null, "registered successful");
    }

    public AuthResponse login(AuthRequest req) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(req.getUsername());
        String token = jwtUtil.generateToken(userDetails);
        return new AuthResponse(token);
    }
}
