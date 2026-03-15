package com.syncly.backend.availability;

import com.syncly.backend.meetingtypes.MeetingType;
import com.syncly.backend.meetingtypes.MeetingTypeRepository;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepo;
    private final MeetingTypeRepository meetingTypeRepo;

    public AvailabilityService(AvailabilityRepository availabilityRepo, MeetingTypeRepository meetingTypeRepo) {
        this.availabilityRepo = availabilityRepo;
        this.meetingTypeRepo = meetingTypeRepo;
    }

    public Availability create(Availability a) {
        return availabilityRepo.save(a);
    }

    public List<Availability> listForOrganizer(Long organizerId) {
        return availabilityRepo.findByOrganizerId(organizerId);
    }

    public Optional<Availability> get(Long id) {
        return availabilityRepo.findById(id);
    }

    public void delete(Long id) {
        availabilityRepo.deleteById(id);
    }

    /**
     * Compute candidate slots for meetingTypeId between from..to (OffsetDateTime).
     * Algorithm:
     *  - Load MeetingType (uses its availableStart/availableEnd and durationMinutes)
     *  - For each calendar day in the range: gather recurring availability entries for that weekday
     *  - Intersect meetingType daily window and availability windows; generate slots of meetingType.durationMinutes
     *
     * Note: does not check bookings/conflicts. Use Booking entity later to exclude taken slots.
     */
    public List<OffsetDateTime> computeSlots(Long meetingTypeId, OffsetDateTime from, OffsetDateTime to) {
        MeetingType mt = meetingTypeRepo.findById(meetingTypeId)
                .orElseThrow(() -> new NoSuchElementException("MeetingType not found"));
        List<OffsetDateTime> slots = new ArrayList<>();
        ZoneOffset zone = from.getOffset();

        LocalDate current = from.toLocalDate();
        LocalDate endDate = to.toLocalDate();

        while (!current.isAfter(endDate)) {
            int dow = current.getDayOfWeek().getValue(); // 1..7
            List<Availability> recurring = availabilityRepo.findByOrganizerIdAndDayOfWeek(mt.getOrganizerId(), dow);

            // for each recurring availability on that weekday
            for (Availability a : recurring) {
                LocalTime availStart = a.getStartTime();
                LocalTime availEnd = a.getEndTime();

                // meeting-type daily window
                LocalTime mtStart = mt.getAvailableStart();
                LocalTime mtEnd = mt.getAvailableEnd();

                // intersection window (LocalTime)
                LocalTime start = availStart.isAfter(mtStart) ? availStart : mtStart;
                LocalTime end = availEnd.isBefore(mtEnd) ? availEnd : mtEnd;
                if (start == null || end == null || !start.isBefore(end)) continue;

                OffsetDateTime windowStart = OffsetDateTime.of(current, start, zone);
                OffsetDateTime windowEnd = OffsetDateTime.of(current, end, zone);

                OffsetDateTime slot = windowStart;
                while (!slot.plusMinutes(mt.getDurationMinutes()).isAfter(windowEnd)) {
                    if (!slot.isBefore(from) && slot.isBefore(to)) {
                        slots.add(slot);
                    }
                    slot = slot.plusMinutes(mt.getDurationMinutes());
                }
            }

            // also consider one-off availability entries that overlap this date
            List<Availability> oneOff = availabilityRepo.findByOrganizerId(mt.getOrganizerId());
            for (Availability a : oneOff) {
                if (a.getDayOfWeek() != null) continue; // skip recurring handled above
                OffsetDateTime s = a.getStartDateTime();
                OffsetDateTime e = a.getEndDateTime();
                if (s == null || e == null) continue;
                // if this one-off overlaps current date
                if (!s.toLocalDate().isAfter(current) && !e.toLocalDate().isBefore(current)) {
                    OffsetDateTime windowStart = s.isAfter(OffsetDateTime.of(current, mt.getAvailableStart(), zone)) ? s : OffsetDateTime.of(current, mt.getAvailableStart(), zone);
                    OffsetDateTime windowEnd = e.isBefore(OffsetDateTime.of(current, mt.getAvailableEnd(), zone)) ? e : OffsetDateTime.of(current, mt.getAvailableEnd(), zone);
                    OffsetDateTime slot = windowStart;
                    while (!slot.plusMinutes(mt.getDurationMinutes()).isAfter(windowEnd)) {
                        if (!slot.isBefore(from) && slot.isBefore(to)) {
                            slots.add(slot);
                        }
                        slot = slot.plusMinutes(mt.getDurationMinutes());
                    }
                }
            }

            current = current.plusDays(1);
        }

        slots.sort(Comparator.naturalOrder());
        return slots;
    }
}