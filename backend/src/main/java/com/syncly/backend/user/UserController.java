package com.syncly.backend.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final SupabaseService supabaseService;

    public UserController(UserService userService, SupabaseService supabaseService) {
        this.userService = userService;
        this.supabaseService = supabaseService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();

        User user = userService.findByEmail(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(404).build();
        
        return ResponseEntity.ok(user);
    }

    @PutMapping(value ="/me", consumes = {"multipart/form-data"})
    public ResponseEntity<User> updateProfile(
            Principal principal,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) String newPassword, // Matches frontend formData
            @RequestParam(required = false) MultipartFile photo
    ) throws IOException {
        if (principal == null) return ResponseEntity.status(401).build();

        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update Full Name
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }

        // Update Password if provided
        if (newPassword != null && !newPassword.isBlank()) {
            // We use the service to handle encoding logic
            userService.updatePassword(user, newPassword);
        }

        // Handle Photo Upload
        if (photo != null && !photo.isEmpty()) {
            String originalFilename = photo.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String path = "profiles/" + user.getId() + extension;
            String url = supabaseService.uploadFile(path, photo);
            user.setPhotoUrl(url);
        }

        User updatedUser = userService.save(user);
        return ResponseEntity.ok(updatedUser);
    }
}