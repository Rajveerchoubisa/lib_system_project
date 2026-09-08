# SmartLibrary Seat Reservations

A full-stack library seat reservation application with selectable seats, atomic checkout holds, an explicit reservation lifecycle, Razorpay payments, and webhook-based confirmation.

## Core architecture

The seat document is the concurrency lock. Holding a seat uses one conditional `findOneAndUpdate`: only an `available` seat or an expired `held` seat can be claimed. If two requests target the last seat, only one update can match.

```text
available seat
     │ atomic hold (5 minutes)
     ▼
   held ──► payment_pending ──► confirmed ──► expired
     │             │
     ├─► cancelled └─► payment_failed
     └─► expired
```

Payment amounts are derived on the backend. Browser signature verification provides a fast response, while the signed Razorpay webhook is the durable confirmation path. Processed webhook event IDs and payment IDs make confirmation idempotent.

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and add MongoDB and Razorpay test credentials.
2. Copy `frontend/.env.example` to `frontend/.env`.
3. Run `npm ci` inside both `backend` and `frontend`.
4. Run `npm start` in `backend` and `npm run dev` in `frontend`.

On an empty database, the backend creates 60 seats across three floors. Existing seats from the previous schema are migrated to the selectable-seat structure during startup.

## Razorpay webhook

Create a webhook in the Razorpay dashboard that points to:

```text
https://YOUR_API_DOMAIN/api/payment/webhook
```

Subscribe to `payment.captured` and `order.paid`, then store the webhook signing secret as `RAZORPAY_WEBHOOK_SECRET`. This secret is separate from `RAZORPAY_KEY_SECRET`.

## Reservation API

- `GET /api/bookings/seats` — seat map and current availability
- `POST /api/bookings/hold` — atomically hold a selected seat; accepts `Idempotency-Key`
- `DELETE /api/bookings/:bookingId/hold` — release an unpaid hold
- `POST /api/bookings/:bookingId/order` — create a server-priced Razorpay order
- `POST /api/bookings/:bookingId/verify` — verify the checkout callback signature
- `POST /api/payment/webhook` — verify and process Razorpay webhooks
- `GET /api/bookings/my` — current user's reservation history

## Verification

```bash
cd backend && npm test
cd frontend && npm run lint
cd frontend && npm run build
```
