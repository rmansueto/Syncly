package com.syncly.backend.meetingtypes;

import org.springframework.stereotype.Service;

import java.time.*;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class MeetingTypeService {

    private final MeetingTypeRepository repo;

    public MeetingTypeService(MeetingTypeRepository repo) {
        this.repo = repo;
    }

    public MeetingType create(MeetingType mt) {
        if (mt.getDurationMinutes() <= 0) {
            mt.setDurationMinutes(30);
        }
        if (mt.getAvailableStart() == null) {
            mt.setAvailableStart(LocalTime.of(9, 0));
        }
        if (mt.getAvailableEnd() == null) {
            mt.setAvailableEnd(LocalTime.of(17, 0));
        }
        return repo.save(mt);
    }

    public MeetingType update(MeetingType mt) {
        return repo.save(mt);
    }

    public List<MeetingType> list(Optional<Long> organizerId) {
        if (organizerId.isPresent()) {
            return repo.findByOrganizerId(organizerId.get());
        } else {
            // Do NOT return all by default
            return List.of(); // or throw an exception
        }
    }

    public Optional<MeetingType> get(Long id) {
        return repo.findById(id);
    }

    // availability(...) unchanged
    public List<OffsetDateTime> availability(Long meetingTypeId, OffsetDateTime from, OffsetDateTime to) {
        MeetingType mt = repo.findById(meetingTypeId).orElseThrow(() -> new NoSuchElementException("MeetingType not found"));
        List<OffsetDateTime> slots = new ArrayList<>();
        ZoneOffset zone = from.getOffset();

        LocalDate currentDate = from.toLocalDate();
        LocalDate endDate = to.toLocalDate();

        while (!currentDate.isAfter(endDate)) {
            OffsetDateTime dayStart = OffsetDateTime.of(currentDate, mt.getAvailableStart(), zone);
            OffsetDateTime dayEnd = OffsetDateTime.of(currentDate, mt.getAvailableEnd(), zone);

            OffsetDateTime slot = dayStart;
            while (!slot.plusMinutes(mt.getDurationMinutes()).isAfter(dayEnd)) {
                if (!slot.isBefore(from) && slot.isBefore(to)) {
                    slots.add(slot);
                }
                slot = slot.plusMinutes(mt.getDurationMinutes());
            }

            currentDate = currentDate.plusDays(1);
        }
        return slots;
    }
}