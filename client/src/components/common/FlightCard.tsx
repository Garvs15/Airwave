import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { GiAirplaneDeparture } from "react-icons/gi";
import { Flight } from "../../redux/flights/flightSlice";
import { convertTo12HourFormat, getDay } from "../../utils/Date";

const FlightCard = ({ flight, isDeparture, departureDate, returnDate }: { flight: Flight, isDeparture:boolean, departureDate:Dayjs, returnDate:Dayjs | null }) => {
  const { time: departureTime, period: departurePeriod } =
    convertTo12HourFormat(flight.departureTime);
  const { time: arrivalTime, period: arrivalPeriod } = convertTo12HourFormat(
    flight.arrivalTime
  );

  return (
    <div className="flex gap-10 xs:gap-5 bg-blue-500 w-[50%] max-lg:w-[70%] max-md:w-[90%] rounded-md justify-center h-[100px] items-center">
      <TimeInfo
        day={isDeparture ? getDay(departureDate) : getDay(returnDate)}
        time={departureTime}
        period={departurePeriod}
        location={flight.departureAirport.city}
      />
      <ConnectionDot time={flight.flightTime} />
      <TimeInfo
        day={isDeparture ? getDay(dayjs(departureDate)!.add(flight?.nextDay, "day")) : getDay(dayjs(returnDate)!.add(flight?.nextDay, "day"))}
        time={arrivalTime}
        period={arrivalPeriod}
        location={flight.arrivalAirport.city}
      />
    </div>
  );
};

const TimeInfo = ({
  day,
  time,
  period,
  location,
}: {
  day: string;
  time: string;
  period: string;
  location: string;
}) => (
  <div className="text-white">
    <div className="text-xs">{day}</div>
    <div className="flex text-2xl max-sm:text-lg font-semibold gap-2">
      <div className="">{time}</div>
      <div className="">{period}</div>
    </div>
    <div className="text-sm">{location}</div>
  </div>
);

const ConnectionDot = ({ time }: { time: string }) => (
  <div className="text-center space-y-1 text-white">
    <div className="text-xs">{time}</div>
    <div className="flex items-center">
      <div className="w-[10px] h-[10px] rounded-full border border-white max-xs:hidden" />
      <div className="border w-[50px] border-dashed h-[0] max-xs:hidden" />
      <div>
        <div className="bg-white text-blue-500 border border-blue-500 rounded-full text-lg p-2 flex justify-center items-center">
          <GiAirplaneDeparture />
        </div>
      </div>
      <div className="border w-[50px] border-dashed h-[0] max-xs:hidden" />
      <div className="w-[10px] h-[10px] rounded-full bg-white max-xs:hidden" />
    </div>
    <div className="text-xs">Direct</div>
  </div>
);

export default FlightCard;
