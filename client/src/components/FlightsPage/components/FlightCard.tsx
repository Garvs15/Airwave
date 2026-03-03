import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getFlight,
  getReturnFlight,
} from "../../../redux/flights/flightsAction";
import {
  Flight,
  setDepartureAirportId,
  setisDeparture,
  setReturnAirportId,
} from "../../../redux/flights/flightSlice";
import { AppDispatch, RootState } from "../../../redux/store";
import { convertTo12HourFormat, getDay } from "../../../utils/Date";
import Button from "../../common/Button";
import ConnectionDot from "../../common/ConnectionDot";
import PriceInfo from "../../common/PriceInfo";
import TimeInfo from "../../common/TimeInfo";
import { resetSingleReturnFlight } from "../../../redux/flights/singleReturnFlightSlice";

interface FlightCardProps {
  flight: Flight;
  isDeparture: boolean;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, isDeparture }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { time: departureTime, period: departurePeriod } =
    convertTo12HourFormat(flight.departureTime);
  const { time: arrivalTime, period: arrivalPeriod } = convertTo12HourFormat(
    flight.arrivalTime
  );

  const navigate = useNavigate();
  const { departureDate, returnDate } = useSelector(
    (state: RootState) => state.search
  );
  const flightDate = isDeparture ? departureDate : returnDate;

  const handleClick = () => {
    if (isDeparture) {
      dispatch(getFlight(flight.id));
      dispatch(setDepartureAirportId(flight.id));
      if (!returnDate) {
        dispatch(setReturnAirportId(""));
        dispatch(resetSingleReturnFlight());
        navigate(`/passenger-details/${flight.id}`);
      } else {
        dispatch(setisDeparture(false));
      }
    } else {
      dispatch(getReturnFlight(flight.id));
      dispatch(setReturnAirportId(flight.id));
      dispatch(setisDeparture(true));
    }
  };

  return (
    <div className="flex max-md:flex-col bg-white rounded-xl gap-10 max-md:gap-4 justify-center items-center w-max max-lg:px-10 px-20 max-md:p-5 py-8 h-max shadow-lg">
      <div className="flex gap-10 xs:gap-5">
        <TimeInfo
          day={getDay(flightDate)}
          time={departureTime}
          period={departurePeriod}
          location={flight.departureAirport.city}
        />
        <ConnectionDot time={flight.flightTime} />
        <TimeInfo
          day={getDay(flightDate?.add(flight.nextDay, "day"))}
          time={arrivalTime}
          period={arrivalPeriod}
          location={flight.arrivalAirport.city}
        />
      </div>
      <div className="border border-dashed h-[100px] w-[0] max-md:h-[0] max-md:w-full" />
      <div className="md:space-y-4 max-md:flex gap-4 justify-end items-center w-full">
        <PriceInfo price={flight.price} currency="Rs" />
        <div>
          <Button onClick={handleClick}>Choose Flight</Button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
