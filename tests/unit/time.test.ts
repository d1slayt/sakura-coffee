import { describe, expect, it } from "vitest";
import { addDays, isIsoDate, toZonedIsoDate, toZonedTime, weekdayOf, zonedTimeToUtc } from "@/lib/time";

describe("zonedTimeToUtc", () => {
  it("converts Moscow wall time (UTC+3, no DST) to UTC", () => {
    expect(zonedTimeToUtc("2026-10-13", "10:00", "Europe/Moscow").toISOString()).toBe("2026-10-13T07:00:00.000Z");
  });

  it("handles both sides of a DST change", () => {
    // Berlin: CEST (UTC+2) until 25 Oct 2026, then CET (UTC+1).
    expect(zonedTimeToUtc("2026-10-24", "09:00", "Europe/Berlin").toISOString()).toBe("2026-10-24T07:00:00.000Z");
    expect(zonedTimeToUtc("2026-10-26", "09:00", "Europe/Berlin").toISOString()).toBe("2026-10-26T08:00:00.000Z");
  });

  it("round-trips through the zoned formatters", () => {
    const instant = zonedTimeToUtc("2026-12-31", "23:30", "Europe/Moscow");
    expect(toZonedIsoDate(instant, "Europe/Moscow")).toBe("2026-12-31");
    expect(toZonedTime(instant, "Europe/Moscow")).toBe("23:30");
  });

  it("rejects malformed input", () => {
    expect(() => zonedTimeToUtc("2026-02-30", "10:00", "Europe/Moscow")).toThrow(RangeError);
    expect(() => zonedTimeToUtc("2026-02-10", "25:00", "Europe/Moscow")).toThrow(RangeError);
  });
});

describe("calendar helpers", () => {
  it("validates ISO dates strictly", () => {
    expect(isIsoDate("2026-10-13")).toBe(true);
    expect(isIsoDate("2026-13-01")).toBe(false);
    expect(isIsoDate("2026-02-29")).toBe(false);
    expect(isIsoDate("13.10.2026")).toBe(false);
  });

  it("adds days across month and year boundaries", () => {
    expect(addDays("2026-12-30", 3)).toBe("2027-01-02");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("returns the weekday of a calendar date", () => {
    expect(weekdayOf("2026-10-12")).toBe(1); // Monday
    expect(weekdayOf("2026-10-18")).toBe(0); // Sunday
  });
});
