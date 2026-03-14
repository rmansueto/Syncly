package com.syncly.backend.register;

import com.syncly.backend.user.User;
import com.syncly.backend.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    private final UserService userService;
    public RegisterController(UserService userService) { this.userService = userService; }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest req) {
        User created = userService.register(req.getEmail(), req.getPassword(), req.getFullName());
        return ResponseEntity.status(201).body(created);
    }
}