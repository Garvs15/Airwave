const Razorpay = require('razorpay');
const axios = require('axios');
const crypto = require('crypto');
const PaymentRepository = require('../repository/payment-repository');
const { RAZORPAY_KEY, RAZORPAY_SECRET, AUTH_PATH, RAZORPAY_WEBHOOK_SECRET } = require('../config/serverConfig');
const transporter = require("../config/transporter");

class PaymentService {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: RAZORPAY_KEY,
            key_secret: RAZORPAY_SECRET,
        });
    }

    async createOrder(options) {
        if (!options || !options.amount || !options.currency) {
            throw new Error('Invalid options for order creation');
        }
    
        try {
            const res = await this.razorpay.orders.create(options);
            return res;
        } catch (error) {
            console.error('Error in Razorpay order creation:', error);
            throw new Error('Failed to create Razorpay order');
        }
    }
    
    async createPayment(data, transaction) {
        if (!data || !data.payment_id || !data.booking_id || !data.user_id || !data.amount) {
            throw new Error('Invalid payment data');
        }
    
        return await PaymentRepository.createPayment(data, transaction);
    }    

    async verifyPaymentSignature(signature, body) {
        if (!signature || !body) {
            throw new Error('Invalid signature or body');
        }

        const hmac = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET);
        hmac.update(JSON.stringify(body));
        const generatedSignature = hmac.digest('hex');
        return generatedSignature === signature;
    }

    async updatePaymentStatus(payment_id, status, payment_details, transaction) {
        if (!payment_id || !status) {
            throw new Error('Payment ID and status are required');
        }
    
        return await PaymentRepository.updatePaymentStatus(payment_id, status, payment_details, transaction);
    }    

    async findPaymentById(payment_id) {
        if (!payment_id) {
            throw new Error('Payment ID is required');
        }

        try {
            const payment = await PaymentRepository.findPaymentById(payment_id);
            return payment;
        } catch (error) {
            console.error('Error finding payment:', error);
            throw new Error('Something went wrong while retrieving payment details');
        }
    }

    async sendConfirmationEmail(user_id) {
        if (!user_id) {
            throw new Error('User ID is required');
        }

        try {
            const user = await axios.get(`${AUTH_PATH}/api/v1/user-details`, {
                params: { id: user_id },
            });

            const email = user.data.data.user.email;

            await transporter.sendMail({
                to: email,
                subject: 'Payment Successful',
                text: 'Your payment has been successfully processed and your booking is confirmed.',
            });
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            throw new Error('Failed to send confirmation email');
        }
    }
}

module.exports = new PaymentService();
