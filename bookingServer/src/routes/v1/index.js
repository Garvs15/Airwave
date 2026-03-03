const express = require('express');
const BookingController = require('../../controllers/booking-controller');
const PaymentController = require('../../controllers/payment-controller');
const { authorizeUser } = require('../../middleware/authMiddleware');
const BookedFlightController = require('../../controllers/bookedFlight-controller');

// Instantiate the controllers
const bookingController = new BookingController();
const bookedFlightController = new BookedFlightController();
const paymentController = new PaymentController();
const router = express.Router();

// Route to create a new booking
router.post('/bookings', authorizeUser, bookingController.create);

// Route to get all bookings for a user
router.post('/get-bookings', authorizeUser, bookingController.getBookings);

// Route to retrieve a specific booking by ID
router.post('/getBookingById', authorizeUser, bookingController.getBookingById);

// Route to find booked flight details by flight ID
router.post('/getBookedFlight', authorizeUser, bookedFlightController.findByFlightId);

// Route to create a payment intent for a booking
router.post('/create-payment-intent', authorizeUser, bookingController.createPaymentIntent);

// Route to create an order using Razorpay payment gateway
router.post('/payment/razorpay', authorizeUser, paymentController.createOrder);

// Route to verify payment
router.post('/payment/verify', paymentController.verifyPayment);

// Health check route to confirm the server is running
router.get('/ping', (req, res) => {
  console.log(`Ping received at ${new Date().toISOString()}`);
  res.json({ message: "Server is awake" });
});

module.exports = router;