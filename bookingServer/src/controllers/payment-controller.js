const BookingService = require("../services/booking-service");
const PaymentService = require("../services/payment-service");
const { deletePaginatedBookingCache } = require("../utils/deleteRedisCache");
const { sequelize } = require('../models/index');

const bookingService = new BookingService();

class PaymentController {
    constructor() {}

    async createOrder(req, res) {
        console.log('[DEBUG] createOrder called with body:', req.body);
        const { booking_id, amount, user_id } = req.body;
    
        // Validate input data
        if (!booking_id || !amount || !user_id) {
             console.log('[DEBUG] Missing required fields');
            return res.status(400).json({ error: 'booking_id, amount, and user_id are required' });
        }
    
        if (typeof amount !== 'number' || amount <= 0) {
              console.log('[DEBUG] Invalid amount:', amount);
            return res.status(400).json({ error: 'amount must be a positive number' });
        }
    
        const transaction = await sequelize.transaction(); // Start transaction
        console.log('[DEBUG] Transaction started for createOrder');

        try {
            const options = {
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                receipt: booking_id.toString(),
            };
             console.log('[DEBUG] Razorpay order options:', options);
    
            // Create order via Razorpay
            const order = await PaymentService.createOrder(options);
            console.log('[DEBUG] Razorpay order response:', order);
    
            if (!order) {
                throw new Error('Failed to create order');
            }
    
            // Create payment entry in the database
            await PaymentService.createPayment(
                {
                    payment_id: order.id,
                    booking_id,
                    user_id,
                    amount,
                    status: 'initiated',
                },
                transaction
            );
            //  console.log('[DEBUG] Creating payment in DB:', paymentData);
             console.log('[DEBUG] Payment record created in DB successfully');
    
            await transaction.commit(); // Commit transaction
             console.log('[DEBUG] Transaction committed for createOrder');
            return res.status(201).json(order); // 201 for resource created
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            await transaction.rollback(); // Rollback on error
            console.log('[DEBUG] Transaction rolled back for createOrder');
            return res.status(500).json({ error: 'Error creating Razorpay order' });
        }
    } 

    async verifyPayment(req, res) {
        console.log('[DEBUG] verifyPayment called with body:', req.body);
        const signature = req.headers['x-razorpay-signature'];
        console.log('[DEBUG] Razorpay signature header:', signature);
        const body = req.body;

        console.log(body, signature);
    
        // Validate input data
        if (!signature || !body || !body.payload || !body.payload.payment || !body.payload.payment.entity) {
             console.log('[DEBUG] Invalid payment verification request');
            return res.status(400).json({ error: 'Invalid payment verification request' });
        }
    
        const transaction = await sequelize.transaction(); // Start transaction
        console.log('[DEBUG] Transaction started for verifyPayment');
    
        try {
            const isValidSignature = await PaymentService.verifyPaymentSignature(signature, body);
             console.log('[DEBUG] Payment signature valid:', isValidSignature);

            if (!isValidSignature) {
                  console.log('[DEBUG] Signature verification failed');
                return res.status(400).json({ error: 'Invalid signature' });
            }

            console.log(isValidSignature, 'isValidSignature');
    
            const { order_id, id } = body.payload.payment.entity;
    
            if (body.event === 'payment.failed') {
                  console.log('[DEBUG] Payment failed event detected');
                await PaymentService.updatePaymentStatus(order_id, 'failed', body.payload.payment.entity, transaction);
                await transaction.commit(); // Commit transaction on failure status update
                return res.status(402).json({ error: 'Payment declined' });
            }
    
            // Update payment status to successful
             console.log('[DEBUG] Payment successful, updating DB...');
            await PaymentService.updatePaymentStatus(order_id, 'successful', body.payload.payment.entity, transaction);
            const paymentDetail = await PaymentService.findPaymentById(order_id);
    
            if (!paymentDetail) {
                throw new Error('Payment not found');
            }
    
            await deletePaginatedBookingCache(paymentDetail.user_id);
             console.log('[DEBUG] Cleared booking cache for user:', paymentDetail.user_id);

            await PaymentService.sendConfirmationEmail(paymentDetail.user_id);
            console.log('[DEBUG] Confirmation email sent to user:', paymentDetail.user_id);
    
            // Update booking status to 'Booked'
            await bookingService.updateBooking(paymentDetail.booking_id, 'Booked', transaction);
             console.log('[DEBUG] Booking status updated to Booked for booking_id:', paymentDetail.booking_id);
    
            await transaction.commit(); // Commit transaction on success
             console.log('[DEBUG] Transaction committed for verifyPayment');
    
            res.status(200).json({ status: 'Payment verified and booking successful' });
        } catch (error) {
            console.error('Error verifying payment:', error);
            await transaction.rollback(); // Rollback on error
            res.status(500).json({ error: 'Error verifying payment' });
        }
    }    
}

module.exports = PaymentController;
