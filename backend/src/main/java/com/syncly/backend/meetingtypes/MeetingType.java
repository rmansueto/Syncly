package com.syncly.backend.meetingtypes;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "meeting_types")
public class MeetingType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(length = 2000)
    private String description;

    // duration in minutes
    private int durationMinutes;

    // organizer id (link to users.id)
    private Long organizerId;

    // daily available window (local time)
    private LocalTime availableStart;
    private LocalTime availableEnd;

    public MeetingType() {}

    // getters / setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }
    public LocalTime getAvailableStart() { return availableStart; }
    public void setAvailableStart(LocalTime availableStart) { this.availableStart = availableStart; }
    public LocalTime getAvailableEnd() { return availableEnd; }
    public void setAvailableEnd(LocalTime availableEnd) { this.availableEnd = availableEnd; }
}