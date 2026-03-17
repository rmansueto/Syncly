package com.syncly.backend.booking;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    // Constructor injection (NO Lombok)
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(@RequestBody Map<String, String> payload) {

        Long meetingTypeId = Long.parseLong(payload.get("meetingTypeId"));
        LocalDate date = LocalDate.parse(payload.get("date"));
        LocalTime time = LocalTime.parse(payload.get("time"));
        String email = payload.get("email");

        return bookingService.createBooking(meetingTypeId, date, time, email);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/meeting/{id}")
    public List<Booking> getByMeetingType(@PathVariable Long id) {
        return bookingService.getBookingsByMeetingType(id);
    }
    @GetMapping("/meeting/{id}/date/{date}")
    public List<Booking> getByMeetingTypeAndDate(
            @PathVariable Long id,
            @PathVariable String date
    ) {
        return bookingService.getBookingsByMeetingTypeAndDate(
                id,
                LocalDate.parse(date)
        );
    }
}