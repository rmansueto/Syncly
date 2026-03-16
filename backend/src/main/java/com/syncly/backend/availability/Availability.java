package com.syncly.backend.availability;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.time.OffsetDateTime;

@Entity
@Table(name = "availability")
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // organizer (user) this availability belongs to
    private Long organizerId;

    // recurring weekly entry: dayOfWeek 1=MON ... 7=SUN
    private Integer dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;

    // optional one-off range (if not recurring)
    private OffsetDateTime startDateTime;
    private OffsetDateTime endDateTime;

    // organizer timezone (IANA), optional — used to interpret startTime/endTime
    private String timezone;

    public Availability() {}

    // getters / setters
    public Long getId() { return id; }
    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public Integer getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public OffsetDateTime getStartDateTime() { return startDateTime; }
    public void setStartDateTime(OffsetDateTime startDateTime) { this.startDateTime = startDateTime; }

    public OffsetDateTime getEndDateTime() { return endDateTime; }
    public void setEndDateTime(OffsetDateTime endDateTime) { this.endDateTime = endDateTime; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
}