const { Payments } = require('../models/index');
const { redis } = require('../config/redis');

class PaymentRepository {
    async createPayment(data, transaction) {
        console.log('[PaymentRepository] createPayment called with data:', data);

        if (!data || !data.payment_id || !data.booking_id || !data.user_id || !data.amount) {
            console.error('[PaymentRepository] Invalid payment data:', data);
            throw new Error('Invalid payment data');
        }

        try {
            const payment = await Payments.create(data, { transaction });
            console.log('[PaymentRepository] Payment created successfully:', payment.dataValues);
            return payment;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw new Error('Failed to create payment');
        }
    }

    async updatePaymentStatus(payment_id, status, payment_details, transaction) {
        console.log(`[PaymentRepository] updatePaymentStatus called for payment_id: ${payment_id}, status: ${status}`);

        if (!payment_id || !status) {
            console.error('[PaymentRepository] Payment ID and status are required');
            throw new Error('Payment ID and status are required');
        }

        try {
            const updatedPayment = await Payments.update(
                { status, payment_details },
                { where: { payment_id }, transaction }
            );
            console.log(`[PaymentRepository] Rows updated: ${rowsUpdated}`);

            // Invalidate cache if exists
            const cachedPayment = await redis.get(`payment_${payment_id}`);
            if (cachedPayment) {
                await redis.del(`payment_${payment_id}`);
                console.log(`[PaymentRepository] Cache invalidated for payment_${payment_id}`);
            }

            return updatedPayment;
        } catch (error) {
            console.error('Error updating payment status:', error);
            throw new Error('Failed to update payment status');
        }
    }

    async findPaymentById(payment_id) {
        console.log(`[PaymentRepository] findPaymentById called for payment_id: ${payment_id}`);

        if (!payment_id) {
            throw new Error('Payment ID is required');
        }

        try {
            const cachedPayment = await redis.get(`payment_${payment_id}`);
            if (cachedPayment) {
                console.log('[PaymentRepository] Payment found in cache:', JSON.parse(cachedPayment));
                return JSON.parse(cachedPayment);
            }

            const payment = await Payments.findOne({ where: { payment_id } });
            if (payment) {
                await redis.set(`payment_${payment_id}`, JSON.stringify(payment), 'EX', 3600);
                console.log('[PaymentRepository] Payment found in DB and cached:', payment.dataValues);
            }

            return payment;
        } catch (error) {
            console.error('Error finding payment by ID:', error);
            throw new Error('Failed to find payment');
        }
    }
}

module.exports = new PaymentRepository();
