package com.syncly.backend.availability;

import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class AvailabilityService {

    private final AvailabilityRepository repo;

    public AvailabilityService(AvailabilityRepository repo) {
        this.repo = repo;
    }

    public List<Availability> getByOrganizer(Long organizerId) {
        return repo.findByOrganizerId(organizerId);
    }

    public Availability save(Availability a) {
        // fallback to default if missing
        if (a.getStartTime() == null) a.setStartTime(LocalTime.of(9, 0));
        if (a.getEndTime() == null) a.setEndTime(LocalTime.of(17, 0));
        if (a.getTimezone() == null) a.setTimezone("UTC");
        return repo.save(a);
    }

    public void bulkReplace(List<Availability> list, Long organizerId) {
        // delete existing
        List<Availability> existing = repo.findByOrganizerId(organizerId);
        repo.deleteAll(existing);
        // save new
        for (Availability a : list) {
            a.setOrganizerId(organizerId);
            save(a);
        }
    }
}