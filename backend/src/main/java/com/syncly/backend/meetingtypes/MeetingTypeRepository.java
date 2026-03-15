package com.syncly.backend.meetingtypes;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MeetingTypeRepository extends JpaRepository<MeetingType, Long> {
    List<MeetingType> findByOrganizerId(Long organizerId);
}