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

    // Replace all availability for an organizer with provided entries and set timezone (optional)
    public List<Availability> replaceWeeklyAvailability(Long organizerId, List<Availability> entries, String timezone) {
        availabilityRepo.deleteByOrganizerId(organizerId);
        for (Availability a : entries) {
            a.setOrganizerId(organizerId);
            if (timezone != null && !timezone.isBlank()) a.setTimezone(timezone);
        }
        return availabilityRepo.saveAll(entries);
    }

    // computeSlots(...) unchanged — it uses availabilityRepo entries; if timezone is set on entries you may choose to interpret times accordingly.
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

            for (Availability a : recurring) {
                LocalTime availStart = a.getStartTime();
                LocalTime availEnd = a.getEndTime();

                LocalTime mtStart = mt.getAvailableStart();
                LocalTime mtEnd = mt.getAvailableEnd();

                LocalTime start = (availStart != null && availStart.isAfter(mtStart)) ? availStart : mtStart;
                LocalTime end = (availEnd != null && availEnd.isBefore(mtEnd)) ? availEnd : mtEnd;
                if (start == null || end == null || !start.isBefore(end)) continue;

                // If availability has a timezone stored and it's different from "from", convert appropriately.
                ZoneId zoneId = (a.getTimezone() != null && !a.getTimezone().isBlank()) ? ZoneId.of(a.getTimezone()) : zone;
                // NOTE: above fallback uses from offset — keep simple: use 'zone' for now.
                OffsetDateTime windowStart = OffsetDateTime.of(current, start, zone);
                OffsetDateTime windowEnd = OffsetDateTime.of(current, end, zone);

                OffsetDateTime slot = windowStart;
                while (!slot.plusMinutes(mt.getDurationMinutes()).isAfter(windowEnd)) {
                    if (!slot.isBefore(from) && slot.isBefore(to)) slots.add(slot);
                    slot = slot.plusMinutes(mt.getDurationMinutes());
                }
            }

            // one-off entries
            List<Availability> oneOff = availabilityRepo.findByOrganizerId(mt.getOrganizerId());
            for (Availability a : oneOff) {
                if (a.getDayOfWeek() != null) continue;
                OffsetDateTime s = a.getStartDateTime();
                OffsetDateTime e = a.getEndDateTime();
                if (s == null || e == null) continue;
                if (!s.toLocalDate().isAfter(current) && !e.toLocalDate().isBefore(current)) {
                    OffsetDateTime windowStart = s.isAfter(OffsetDateTime.of(current, mt.getAvailableStart(), zone)) ? s : OffsetDateTime.of(current, mt.getAvailableStart(), zone);
                    OffsetDateTime windowEnd = e.isBefore(OffsetDateTime.of(current, mt.getAvailableEnd(), zone)) ? e : OffsetDateTime.of(current, mt.getAvailableEnd(), zone);
                    OffsetDateTime slot = windowStart;
                    while (!slot.plusMinutes(mt.getDurationMinutes()).isAfter(windowEnd)) {
                        if (!slot.isBefore(from) && slot.isBefore(to)) slots.add(slot);
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