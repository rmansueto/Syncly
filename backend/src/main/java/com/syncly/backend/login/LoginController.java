package com.syncly.backend.login;

import com.syncly.backend.auth.AuthResponse;
import com.syncly.backend.auth.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final AuthService authService;
    public LoginController(AuthService authService) { this.authService = authService; }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        AuthResponse resp = authService.authenticate(req.getEmail(), req.getPassword());
        return ResponseEntity.ok(resp);
    }
}