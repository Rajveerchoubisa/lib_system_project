import { RESERVATION_STATUS } from "../models/booking.js";

const transitions = Object.freeze({
  [RESERVATION_STATUS.HELD]: [
    RESERVATION_STATUS.PAYMENT_PENDING,
    RESERVATION_STATUS.CANCELLED,
    RESERVATION_STATUS.EXPIRED,
  ],
  [RESERVATION_STATUS.PAYMENT_PENDING]: [
    RESERVATION_STATUS.CONFIRMED,
    RESERVATION_STATUS.PAYMENT_FAILED,
    RESERVATION_STATUS.EXPIRED,
  ],
  [RESERVATION_STATUS.PAYMENT_FAILED]: [
    RESERVATION_STATUS.PAYMENT_PENDING,
    RESERVATION_STATUS.CANCELLED,
    RESERVATION_STATUS.EXPIRED,
  ],
  [RESERVATION_STATUS.CONFIRMED]: [RESERVATION_STATUS.CANCELLED, RESERVATION_STATUS.EXPIRED],
  [RESERVATION_STATUS.LEGACY_ACTIVE]: [
    RESERVATION_STATUS.CONFIRMED,
    RESERVATION_STATUS.CANCELLED,
    RESERVATION_STATUS.EXPIRED,
  ],
  [RESERVATION_STATUS.CANCELLED]: [],
  [RESERVATION_STATUS.EXPIRED]: [],
});

export function canTransition(from, to) {
  return transitions[from]?.includes(to) ?? false;
}

export function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    const error = new Error(`Invalid reservation transition: ${from} -> ${to}`);
    error.statusCode = 409;
    throw error;
  }
}

export function addMonths(dateValue, months) {
  const date = new Date(dateValue);
  const originalDay = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(originalDay, lastDay));
  return date;
}
