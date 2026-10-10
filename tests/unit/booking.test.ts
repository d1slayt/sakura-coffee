import { describe, expect, it } from "vitest";
import { bookingWindow, checkBookingDate, isSessionTime, sessionStartUtc } from "@/lib/booking";

// Friday 9 October 2026, 23:30 in Moscow (20:30 UTC).
const now = new Date("2026-10-09T20:30:00Z");

describe("booking rules", () => {
  it("opens bookings from tomorrow (shop-local) for 30 days", () => {
    expect(bookingWindow(now)).toEqual({ firstDate: "2026-10-10", lastDate: "2026-11-08" });
  });

  it("uses the shop's day, not UTC's", () => {
    // 21:30 UTC is already 00:30 on Saturday in Moscow, so Saturday is "today".
    expect(bookingWindow(new Date("2026-10-09T21:30:00Z")).firstDate).toBe("2026-10-11");
  });

  it("rejects today and past dates", () => {
    expect(checkBookingDate("2026-10-09", now)).toBe("TOO_SOON");
    expect(checkBookingDate("2026-01-01", now)).toBe("TOO_SOON");
  });

  it("rejects dates beyond the window", () => {
    expect(checkBookingDate("2026-11-09", now)).toBe("TOO_FAR");
  });

  it("rejects Mondays (roasting day)", () => {
    expect(checkBookingDate("2026-10-12", now)).toBe("CLOSED_DAY");
  });

  it("accepts a valid day", () => {
    expect(checkBookingDate("2026-10-13", now)).toBeNull();
  });

  it("only accepts listed session times", () => {
    expect(isSessionTime("10:00")).toBe(true);
    expect(isSessionTime("19:00")).toBe(true);
    expect(isSessionTime("12:30")).toBe(false);
    expect(isSessionTime("20:00")).toBe(false);
    expect(isSessionTime("10:00; DROP TABLE")).toBe(false);
  });

  it("stores sessions as UTC instants", () => {
    expect(sessionStartUtc("2026-10-13", "09:00").toISOString()).toBe("2026-10-13T06:00:00.000Z");
  });
});
