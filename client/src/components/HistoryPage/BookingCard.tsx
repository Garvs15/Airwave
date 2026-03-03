import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";
import { convertTo12HourFormat, getDay } from "../../utils/Date";
import Button from "../common/Button";
import ConnectionDot from "../common/ConnectionDot";
import PriceInfo from "../common/PriceInfo";
import TimeInfo from "../common/TimeInfo";
import usePayment from "../../hooks/usePayment";

interface BookingCardProps {
  booking: any;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const navigate = useNavigate();
  const {processPayment} = usePayment();

  const { time: departureTime, period: departurePeriod } =
    convertTo12HourFormat(booking.flightDetails.departureTime);
  const { time: arrivalTime, period: arrivalPeriod } = convertTo12HourFormat(
    booking.flightDetails.arrivalTime
  );

  const { time: returnDepartureTime, period: returnDeparturePeriod } =
    convertTo12HourFormat(booking.returnFlightDetails?.departureTime);
  const { time: returnArrivalTime, period: returnArrivalPeriod } =
    convertTo12HourFormat(booking.returnFlightDetails?.arrivalTime);

  const handleBookingDetailsClick = () => {
    navigate(`/booking-details/${booking.id}`);
  };

  const handleCompletePaymentClick = () => {
    const totalPrice = booking.flightDetails.price + (booking.returnFlightDetails?.price || 0);
    processPayment(booking.bookedSeats, totalPrice, booking.id);
  };

  return (
    <div className="max-xs:w-[90%] w-max flex max-md:flex-col bg-white rounded-xl gap-10 max-md:gap-4 justify-center items-center max-lg:px-10 px-20 max-md:p-5 py-8 h-max shadow-lg">
      <div className="space-y-10 w-full">
        <div className="space-y-2 w-full">
          <div className="text-sm">Departure Date: {booking.bookingDate}</div>
          <div className="flex max gap-10 max-xs:justify-between w-full">
            <TimeInfo
              day={getDay(booking.bookingDate)}
              time={departureTime}
              period={departurePeriod}
              location={booking.flightDetails.departureAirport.city}
            />
            <ConnectionDot time={booking.flightDetails.flightTime} />
            <TimeInfo
              day={getDay(
                dayjs(booking.bookingDate).add(
                  booking.flightDetails.nextDay,
                  "day"
                )
              )}
              time={arrivalTime}
              period={arrivalPeriod}
              location={booking.flightDetails.arrivalAirport.city}
            />
          </div>
        </div>
        {booking.returnFlightDetails && (
          <div className="space-y-2 w-full">
            <div className="text-sm">Return Date: {booking.returnBookingDate}</div>
            <div className="flex w-full gap-10 max-xs:justify-between">
              <TimeInfo
                day={getDay(booking.returnBookingDate)}
                time={returnDepartureTime}
                period={returnDeparturePeriod}
                location={booking.returnFlightDetails.departureAirport.city}
              />
              <ConnectionDot time={booking.flightDetails.flightTime} />
              <TimeInfo
                day={getDay(
                  dayjs(booking.returnBookingDate).add(
                    booking.returnFlightDetails.nextDay,
                    "day"
                  )
                )}
                time={returnArrivalTime}
                period={returnArrivalPeriod}
                location={booking.returnFlightDetails.arrivalAirport.city}
              />
            </div>
          </div>
        )}
      </div>
      <div className="border border-dashed h-[100px] w-[0] max-md:h-[0] max-md:w-full" />
      <div className="md:space-y-4 max-md:flex gap-4 justify-end items-center w-full">
        <PriceInfo price={booking.totalCost} currency="Rs" />
        <div className="flex flex-col gap-4">
          <Button onClick={handleBookingDetailsClick}>Booking Details</Button>
          {booking.status === "InProcess" && (
            <Button onClick={handleCompletePaymentClick}>
              Complete Payment
            </Button>
          )}
          <div
            className={`text-sm text-white font-semibold w-max py-1 px-2 rounded-md ${
              booking.status === "InProcess"
                ? "bg-[#F19E0C]"
                : booking.status === "Booked"
                ? "bg-[#008000]"
                : "bg-[#DF2128]"
            }`}
          >
            Status: {booking.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
