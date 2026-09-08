import assert from "node:assert/strict";
import test from "node:test";
import { RESERVATION_STATUS } from "../models/booking.js";
import { addMonths, assertTransition, canTransition } from "../services/reservationState.js";

test("reservation follows the hold -> payment -> confirmed path", () => {
  assert.equal(canTransition(RESERVATION_STATUS.HELD, RESERVATION_STATUS.PAYMENT_PENDING), true);
  assert.equal(canTransition(RESERVATION_STATUS.PAYMENT_PENDING, RESERVATION_STATUS.CONFIRMED), true);
});

test("confirmed reservations cannot move backwards to a hold", () => {
  assert.equal(canTransition(RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.HELD), false);
  assert.throws(
    () => assertTransition(RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.HELD),
    /Invalid reservation transition/
  );
});

test("month arithmetic clamps end-of-month dates", () => {
  assert.equal(addMonths("2026-01-31T00:00:00.000Z", 1).toISOString(), "2026-02-28T00:00:00.000Z");
});
