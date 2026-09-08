import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { signaturesMatch } from "../services/paymentService.js";

test("accepts a valid Razorpay signature", () => {
  const payload = "order_123|pay_456";
  const secret = "test-secret";
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  assert.equal(signaturesMatch(payload, signature, secret), true);
});

test("rejects invalid and missing signatures", () => {
  assert.equal(signaturesMatch("payload", "invalid", "secret"), false);
  assert.equal(signaturesMatch("payload", "", "secret"), false);
});
