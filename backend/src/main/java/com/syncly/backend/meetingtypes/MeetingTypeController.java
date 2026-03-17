package com.syncly.backend.meetingtypes;

import com.syncly.backend.user.User;
import com.syncly.backend.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meeting-types")
public class MeetingTypeController {

    private final MeetingTypeService service;
    private final UserService userService;

    public MeetingTypeController(MeetingTypeService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<MeetingType> create(@RequestBody MeetingType mt, Principal principal) {
        // set organizer from authenticated user if available
        if (principal != null) {
            User u = userService.findByEmail(principal.getName())
                    .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED));
            mt.setOrganizerId(u.getId());
        }
        MeetingType created = service.create(mt);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping
    public List<MeetingType> list(Principal principal) {
        if (principal == null) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);
        }

        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED));

        return service.list(Optional.of(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingType> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MeetingType> update(@PathVariable Long id, @RequestBody MeetingType payload, Principal principal) {
        if (principal == null) throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);
        User user = userService.findByEmail(principal.getName())
                .orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED));

        MeetingType existing = service.get(id).orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND));
        // enforce owner
        if (!existing.getOrganizerId().equals(user.getId())) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN);
        }

        // apply allowed updates
        existing.setTitle(payload.getTitle());
        existing.setDescription(payload.getDescription());
        existing.setDurationMinutes(payload.getDurationMinutes());
        existing.setAvailableStart(payload.getAvailableStart());
        existing.setAvailableEnd(payload.getAvailableEnd());
        existing.setActive(payload.getActive() == null ? true : payload.getActive());

        MeetingType saved = service.update(existing);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<List<OffsetDateTime>> availability(
            @PathVariable Long id,
            @RequestParam String from,
            @RequestParam String to
    ) {
        OffsetDateTime f = OffsetDateTime.parse(from);
        OffsetDateTime t = OffsetDateTime.parse(to);
        return ResponseEntity.ok(service.availability(id, f, t));
    }
}