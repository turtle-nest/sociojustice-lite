package com.sociojustice.auth.web;

import com.sociojustice.auth.model.User;
import com.sociojustice.auth.service.AuthService;
import com.sociojustice.auth.web.dto.RegisterRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User saved = authService.register(request.getEmail(), request.getPassword());

        return ResponseEntity
                .created(URI.create("/api/users/" + saved.getId()))
                .body(Map.of(
                        "id", saved.getId(),
                        "email", saved.getEmail()
                ));
    }
}
