import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FlightCard from "../components/common/FlightCard";
import PassengerCard from "../components/common/PassengerCard";
import OrderDetailsCard from "../components/PassengerDetails/OrderDetailsCard";
import { getBookingById } from "../redux/bookings/bookingAction";
import { Passenger } from "../redux/passengers/passengerReducer";
import { AppDispatch, RootState } from "../redux/store";
import usePayment from "../hooks/usePayment";

const BookingDetails = () => {
  const [booking, setBooking] = useState<any>(null);
  const { bookingId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const { processPayment } = usePayment();

  const getBooking = async () => {
    const res = await dispatch(
      getBookingById({ bookingId, token: user.token })
    );
    setBooking(res.payload);
  };

  const handleCompletePaymentClick = () => {
    const totalPrice =
      booking.flightDetails.price + (booking.returnFlightDetails?.price || 0);
    processPayment(booking.bookedSeats, totalPrice, booking.id);
  };

  useEffect(() => {
    getBooking();
  }, [user?.id]);

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-75px)] py-10 flex flex-col items-center space-y-5">
      <div className="w-[50%] max-lg:w-[70%] max-md:w-[90%] flex justify-between">
        <div className="text-2xl font-bold">Booking Details</div>
        <div
          className={`text-sm text-white self-center font-semibold w-max py-1 px-2 rounded-md ${
            booking?.status === "InProcess"
              ? "bg-[#F19E0C]"
              : booking?.status === "Booked"
              ? "bg-[#008000]"
              : "bg-[#DF2128]"
          }`}
        >
          Status: {booking?.status}
        </div>
      </div>
      {booking && (
        <>
          <FlightCard
            flight={booking?.flightDetails}
            isDeparture={true}
            departureDate={booking.bookingDate}
            returnDate={booking.returnBookingDate}
          />
          {booking?.returnFlightDetails && (
            <FlightCard
              flight={booking?.returnFlightDetails}
              isDeparture={false}
              departureDate={booking.bookingDate}
              returnDate={booking.returnBookingDate}
            />
          )}
          <OrderDetailsCard
            passenger={booking?.bookedSeats}
            baseFare={
              booking.flightDetails.price +
              (booking.returnFlightDetails?.price || 0)
            }
          />
          {booking.passengers.map((passenger: Passenger, index: number) => (
            <PassengerCard
              key={index}
              passenger={passenger}
              index={index}
              isInternational={booking.flightDetails.isInternational}
              fromHistory={true}
            />
          ))}
          {booking.status === "InProcess" && (
            <button
              onClick={() => handleCompletePaymentClick()}
              className="mt-4 bg-orange-400 text-white py-2 px-4 rounded w-[50%] max-lg:w-[70%] max-md:w-[90%]"
            >
              Complete Payment
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BookingDetails;
