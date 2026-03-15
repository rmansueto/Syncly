package com.syncly.backend.meetingtypes;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meeting-types")
public class MeetingTypeController {

    private final MeetingTypeService service;

    public MeetingTypeController(MeetingTypeService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MeetingType> create(@RequestBody MeetingType mt) {
        MeetingType created = service.create(mt);
        return ResponseEntity.status(201).body(created);
    }

    @GetMapping
    public List<MeetingType> list(@RequestParam Optional<Long> organizerId) {
        return service.list(organizerId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingType> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
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