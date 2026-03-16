package com.syncly.backend.availability;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByOrganizerId(Long organizerId);
    List<Availability> findByOrganizerIdAndDayOfWeek(Long organizerId, Integer dayOfWeek);

    // delete all recurring/one-off availability for an organizer
    void deleteByOrganizerId(Long organizerId);
}