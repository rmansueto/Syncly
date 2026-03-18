package com.syncly.backend.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final SupabaseService supabaseService; // service to upload files

    public UserController(UserService userService, SupabaseService supabaseService) {
        this.userService = userService;
        this.supabaseService = supabaseService;
    }

    // Get current user info
    @GetMapping("/me")
    public ResponseEntity<User> getMe(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();

        User user = userService.findByEmail(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(404).build();
        
        return ResponseEntity.ok(user);
    }
    // Update profile (full name and photo)
    @PutMapping(value ="/me", consumes = {"multipart/form-data"})
    public ResponseEntity<User> updateProfile(
            Principal principal,
            @RequestParam(required = false) String fullName,
            @RequestParam(required = false) MultipartFile photo
    ) throws IOException {
        if (principal == null) return ResponseEntity.status(401).build();

        User user = userService.findByEmail(principal.getName()).orElseThrow();
        if (fullName != null) user.setFullName(fullName);

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

        userService.save(user); // save changes
        return ResponseEntity.ok(user);
    }
}