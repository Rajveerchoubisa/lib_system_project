// utils/paymentGateway.js
// Example integration with Razorpay for UPI payments

const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
const createPaymentOrder = async (amount, bookingId, userDetails) => {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      payment_capture: 1,
      notes: {
        booking_id: bookingId,
        user_id: userDetails.userId
      }
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw new Error('Payment order creation failed');
  }
};

// Verify payment signature
const verifyPaymentSignature = (paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;
  
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpay_signature;
};

// Alternative: PhonePe Integration Example
const initiatePhonePePayment = async (amount, bookingId, userDetails) => {
  try {
    // PhonePe API integration
    const merchantTransactionId = `booking_${bookingId}_${Date.now()}`;
    
    const paymentData = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userDetails.userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.BASE_URL}/payment/callback`,
      redirectMode: "POST",
      callbackUrl: `${process.env.BASE_URL}/api/payment/webhook`,
      mobileNumber: userDetails.phone,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    };

    // Encode payload
    const base64Payload = Buffer.from(JSON.stringify(paymentData)).toString('base64');
    
    // Create checksum
    const checksum = crypto
      .createHash('sha256')
      .update(base64Payload + '/pg/v1/pay' + process.env.PHONEPE_SALT_KEY)
      .digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX;

    return {
      payload: base64Payload,
      checksum: checksum,
      merchantTransactionId: merchantTransactionId
    };
  } catch (error) {
    console.error('Error initiating PhonePe payment:', error);
    throw new Error('PhonePe payment initiation failed');
  }
};

module.exports = {
  createPaymentOrder,
  verifyPaymentSignature,
  initiatePhonePePayment
};

// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPaymentSignature } = require('../utils/paymentGateway');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Create payment order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const orderData = await createPaymentOrder(
      booking.totalPrice, 
      bookingId, 
      { userId: req.user.id }
    );

    res.json(orderData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { bookingId, paymentData } = req.body;
    
    const isValidSignature = verifyPaymentSignature(paymentData);
    
    if (!isValidSignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update booking status
    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.status = 'active';
      booking.paymentId = paymentData.razorpay_payment_id;
      booking.paidAt = new Date();
      await booking.save();

      // Mark seat as booked
      await Seat.findByIdAndUpdate(booking.seatId, {
        isBooked: true,
        bookedBy: booking.userId,
        bookingId: booking._id
      });
    }

    res.json({ 
      message: 'Payment verified successfully',
      bookingId: booking._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Payment webhook (for server-to-server verification)
router.post('/webhook', async (req, res) => {
  try {
    // Handle payment webhook from gateway
    const webhookData = req.body;
    
    // Verify webhook signature (implement based on your payment gateway)
    // Update booking status accordingly
    
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

module.exports = router;