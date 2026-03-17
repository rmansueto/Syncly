package com.syncly.backend.booking;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    // Constructor injection (NO Lombok)
    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(Long meetingTypeId, LocalDate date, LocalTime time, String email) {

        if (email == null || email.isEmpty()) {
            throw new RuntimeException("Email is required");
        }

        List<Booking> existing = bookingRepository.findByDateAndMeetingTypeId(date, meetingTypeId);

        boolean alreadyBooked = existing.stream()
                .anyMatch(b -> b.getTime().equals(time));

        if (alreadyBooked) {
            throw new RuntimeException("Time slot already booked");
        }

        Booking booking = new Booking();
        booking.setMeetingTypeId(meetingTypeId);
        booking.setDate(date);
        booking.setTime(time);
        booking.setEmail(email);

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByMeetingType(Long meetingTypeId) {
        return bookingRepository.findByMeetingTypeId(meetingTypeId);
    }
    public List<Booking> getBookingsByMeetingTypeAndDate(Long meetingTypeId, LocalDate date) {
        return bookingRepository.findByDateAndMeetingTypeId(date, meetingTypeId);
    }
}