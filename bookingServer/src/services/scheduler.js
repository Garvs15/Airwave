const schedule = require('node-schedule');
const { Booking, BookedFlights } = require('../models/index');

// Function to schedule an update for booking status after 30 minutes
function scheduleBookingStatusUpdate(bookingId, createdAt) {
  // Validate bookingId and createdAt input
  if (!bookingId || !createdAt) {
    console.error('Invalid bookingId or createdAt provided for scheduling.');
    return;
  }

  // Calculate the time 30 minutes from the booking creation time
  const thirtyMinutesLater = new Date(new Date(createdAt).getTime() + 30 * 60 * 1000);
  console.log(`Booking status will be updated at: ${thirtyMinutesLater}`);

  // Schedule the job to update the booking status
  schedule.scheduleJob(thirtyMinutesLater, async () => {
    try {
      // Find the booking by its ID
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        console.log(`Booking with ID ${bookingId} not found.`);
        return;
      }

      // Check if the booking is still in process before updating
      if (booking.status !== 'InProcess') {
        console.log(`Booking ${bookingId} is not in process. Current status: ${booking.status}`);
        return;
      }

      // Find the booked flight associated with the booking
      const bookedFlight = await BookedFlights.findByPk(booking.bookedFlightId);
      if (!bookedFlight) {
        console.log(`Booked flight for booking ID ${bookingId} not found.`);
        return;
      }

      const totalSeats = bookedFlight.noOfSeats;
      const seats = booking.bookedSeats;

      // Update booking status to 'Rejected'
      await Booking.update(
        { status: 'Rejected' },
        { where: { id: bookingId } }
      );

      // Update the booked flight's available seats
      await BookedFlights.update(
        { noOfSeats: totalSeats - seats },
        { where: { id: booking.bookedFlightId } }
      );

      console.log(`Booking ${bookingId} status updated to 'Rejected'`);
    } catch (error) {
      // Log any errors that occur during the update process
      console.error('Error updating booking status:', error.message);
    }
  });
}

module.exports = { scheduleBookingStatusUpdate };
