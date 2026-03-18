package com.syncly.backend.availability;

import com.syncly.backend.user.User;
import com.syncly.backend.user.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@CrossOrigin(origins = "http://localhost:3000")
public class AvailabilityController {

    private final AvailabilityService service;
    private final UserService userService;

    public AvailabilityController(AvailabilityService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @GetMapping
    public List<Availability> getCurrentUserAvailability(Principal principal) {
        if (principal == null)
            throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);

        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED));

        return service.getByOrganizer(user.getId());
    }

    @PostMapping("/bulk")
    public ResponseEntity<Void> setAvailability(@RequestBody List<Availability> list, Principal principal) {
        if (principal == null)
            throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);

        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED));

        service.bulkReplace(list, user.getId());
        return ResponseEntity.ok().build();
    }
}