import throttle from "lodash.throttle";
import React, { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import DetailsCard from "../components/PassengerDetails/DetailsCard";
import OrderDetailsCard from "../components/PassengerDetails/OrderDetailsCard";
import FlightCard from "../components/common/FlightCard";
import PassengerCard from "../components/common/PassengerCard";
import usePayment from "../hooks/usePayment";
import { bookFlight } from "../redux/flights/bookingAction";
import { getFlight, getReturnFlight } from "../redux/flights/flightsAction";
import { addPassenger } from "../redux/passengers/passengerActions";
import { Passenger } from "../redux/passengers/passengerReducer";
import { AppDispatch, RootState } from "../redux/store";
import { getDate } from "../utils/Date";

const PassengerDetails = () => {
  const { flightId, returnFlightId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { processPayment } = usePayment();

  const singleFlight = useSelector((state: RootState) => state.singleFlight);
  const singleReturnFlight = useSelector(
    (state: RootState) => state.singleReturnFlight
  );
  const user = useSelector((state: RootState) => state.user);
  const { passenger, departureDate, returnDate } = useSelector(
    (state: RootState) => state.search
  );
  const { passengers } = useSelector((state: RootState) => state.passengers);

  const allDetailsFilled = () => {
    return passengers.every(
      (p: Passenger) =>
        p.name && p.email && p.phoneNumber && p.dob && p.gender && p.countryCode
    );
  };

  const userDetailsFilled = () => {
    if (!user.name || !user.email || !user.phone) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    dispatch(getFlight(flightId!));
    if (returnFlightId) {
      dispatch(getReturnFlight(returnFlightId));
    }
  }, [dispatch, flightId, returnFlightId]);

  const handleAddPassenger = () => {
    if (passengers.length === passenger) {
      toast.error(`You can only add ${passenger} passengers`);
      return;
    }
    dispatch(addPassenger());
  };

  const handleSubmit = async () => {
    if (!userDetailsFilled()) {
      toast.error("Please fill all the details of user.");
      return;
    }
    if (passengers.length !== passenger) {
      toast.error("Please add all passenger details before submitting.");
    } else {
      if (!allDetailsFilled()) {
        toast.error("Please fill all the details of passenger.");
        return;
      }
      const bookingData = {
        flightId: singleFlight.id,
        userId: user.id,
        bookedSeats: passenger,
        bookingDate: getDate(departureDate),
        ...(singleReturnFlight?.id && {
          returnFlightId: singleReturnFlight.id,
          returnBookingDate: getDate(returnDate),
        }),
      };
      const payload = {
        bookingData,
        passengersData: passengers,
        email: user.email,
      };

      try {
        const res = await dispatch(bookFlight({ ...payload, token: user.token }));

        // ✅ Safe access with optional chaining
        const bookingId = res.payload?.data?.booking?.id;
        if (!bookingId) {
          toast.error("Booking failed. Please try again.");
          return;
        }

        let price = singleFlight.price;
        if (singleReturnFlight.id) {
          price += singleReturnFlight.price;
        }

        processPayment(
          bookingData.bookedSeats,
          price,
          res.payload.data.booking.id,
          true
        );
      } catch (error) {
        console.error("Booking error:", error);
        toast.error("Booking failed due to network or server error.");
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledHandleSubmit = useCallback(
    throttle(() => handleSubmit(), 2000),
    [handleSubmit]
  );

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-75px)] py-10 flex flex-col items-center space-y-5">
      <div className="w-[50%] max-lg:w-[70%] max-md:w-[90%]">
        <div className="text-2xl font-bold">Booking Details</div>
        <div className="text-sm text-gray-600">
          Fill in your personal data and review your order
        </div>
      </div>
      {singleFlight.departureTime && (
        <FlightCard
          flight={singleFlight}
          isDeparture={true}
          departureDate={departureDate}
          returnDate={returnDate}
        />
      )}
      {returnFlightId && (
        <FlightCard
          flight={singleReturnFlight}
          isDeparture={false}
          departureDate={departureDate}
          returnDate={returnDate}
        />
      )}
      <OrderDetailsCard
        passenger={passenger}
        baseFare={singleFlight.price + singleReturnFlight.price}
      />
      <DetailsCard />
      {passengers.map((passenger: Passenger, index: number) => (
        <PassengerCard
          key={index}
          passenger={passenger}
          index={index}
          isInternational={singleFlight.isInternational}
          fromHistory={false}
        />
      ))}
      <button
        onClick={handleAddPassenger}
        className="mt-4 border border-blue-500 text-blue-500 py-2 px-4 rounded w-[50%] max-lg:w-[70%] max-md:w-[90%]"
      >
        Add Passenger
      </button>
      <button
        onClick={() => throttledHandleSubmit()}
        className="mt-4 bg-orange-400 text-white py-2 px-4 rounded w-[50%] max-lg:w-[70%] max-md:w-[90%]"
      >
        Book Now
      </button>
    </div>
  );
};

export default PassengerDetails;
