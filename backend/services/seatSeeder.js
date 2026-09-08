import Seat from "../models/seat.js";

export async function ensureDefaultSeats() {
  const existing = await Seat.estimatedDocumentCount();
  if (existing > 0) {
    // The previous schema did not have lifecycle fields and never assigned a
    // concrete seat to a booking, so it is safe to make those seats selectable.
    await Seat.updateMany(
      { state: { $exists: false } },
      { $set: { state: "available", isActive: true }, $unset: { bookedBy: 1, bookingId: 1, isBooked: 1 } }
    );
    return;
  }
  const sections = ["Quiet Zone", "Focus Zone", "Window Zone"];
  const seats = Array.from({ length: 60 }, (_, index) => {
    const sectionIndex = Math.floor(index / 20);
    return {
      seatNumber: `${String.fromCharCode(65 + sectionIndex)}${String((index % 20) + 1).padStart(2, "0")}`,
      section: sections[sectionIndex],
      floor: sectionIndex + 1,
      amenities: [index % 2 === 0 ? "Power outlet" : "Natural light"],
    };
  });
  await Seat.insertMany(seats, { ordered: false });
  console.log("Seeded 60 selectable library seats");
}
