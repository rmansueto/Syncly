package com.syncly.backend.availability;

import com.syncly.backend.user.User;
import com.syncly.backend.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AvailabilityService service;
    private final UserService userService;

    public AvailabilityController(AvailabilityService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Availability> create(@RequestBody Availability a, Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        a.setOrganizerId(user.getId());

        return ResponseEntity.status(201).body(service.create(a));
    }

    @GetMapping
    public List<Availability> list(@RequestParam Optional<Long> organizerId, Principal principal) {
        if (organizerId.isPresent()) {
            return service.listForOrganizer(organizerId.get());
        }
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return service.listForOrganizer(user.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Availability> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        Availability existing = service.get(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (existing.getOrganizerId() == null || !existing.getOrganizerId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Bulk replace: replace all availability for the current (authenticated) organizer with the provided list
    @PostMapping("/bulk")
    public ResponseEntity<List<Availability>> bulkReplace(
            Principal principal,
            @RequestParam(required = false) String timezone,
            @RequestBody List<Availability> entries
    ) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        List<Availability> saved = service.replaceWeeklyAvailability(user.getId(), entries, timezone);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/slots")
    public ResponseEntity<List<OffsetDateTime>> slots(
            @RequestParam Long meetingTypeId,
            @RequestParam String from,
            @RequestParam String to
    ) {
        OffsetDateTime f = OffsetDateTime.parse(from);
        OffsetDateTime t = OffsetDateTime.parse(to);
        return ResponseEntity.ok(service.computeSlots(meetingTypeId, f, t));
    }
}