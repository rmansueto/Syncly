package com.syncly.backend.availability;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AvailabilityService service;

    public AvailabilityController(AvailabilityService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Availability> create(@RequestBody Availability a) {
        return ResponseEntity.status(201).body(service.create(a));
    }

    @GetMapping
    public List<Availability> list(@RequestParam Optional<Long> organizerId) {
        return organizerId.map(service::listForOrganizer).orElseGet(() -> List.of());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Availability> get(@PathVariable Long id) {
        return service.get(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Compute available slots for a meeting type between from..to
     * Example:
     * GET /api/availability/slots?meetingTypeId=1&from=2026-03-16T00:00:00+00:00&to=2026-03-18T00:00:00+00:00
     */
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