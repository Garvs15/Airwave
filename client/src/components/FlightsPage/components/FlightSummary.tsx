import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { convertTo12HourFormat } from "../../../utils/Date";

const FlightSummary = ({ handleProceed }: { handleProceed: () => void }) => {
  const singleFlight = useSelector((state: RootState) => state.singleFlight);
  const singleReturnFlight = useSelector(
    (state: RootState) => state.singleReturnFlight
  );

  return (
    (singleFlight.departureTime || singleReturnFlight.departureTime) && <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg py-4 md:px-6 px-2 flex justify-between">
      <div className="flex space-x-10 max-sm:space-x-2">
        {singleFlight.departureTime && <div>
          <div className="text-sm text-gray-400">Departure</div>
          <div className="flex items-center md:gap-2 gap-1">
            <div className="text-sm md:text-lg lg:text-xl md:font-bold">
              {convertTo12HourFormat(singleFlight.departureTime).time}
              {convertTo12HourFormat(singleFlight.departureTime).period}
            </div>
            <ArrowRightIcon className="h-4 w-4 hover:text-gray-400 max-md:hidden" />
            <div className="md:hidden">-</div>
            <div className="text-sm md:text-lg lg:text-xl md:font-bold">
              {convertTo12HourFormat(singleFlight.arrivalTime).time}
              {convertTo12HourFormat(singleFlight.arrivalTime).period}
            </div>
          </div>
          <div className="text-sm md:text-lg lg:text-xl font-semibold">
            ₹{singleFlight.price}
          </div>
        </div>}
        {singleReturnFlight.departureTime &&<div>
          <div className="text-sm text-gray-400">Return</div>
          <div className="flex items-center md:gap-2 gap-1">
            <div className="text-sm md:text-lg lg:text-xl md:font-bold">
              {convertTo12HourFormat(singleReturnFlight.departureTime).time}
              {convertTo12HourFormat(singleReturnFlight.departureTime).period}
            </div>
            <ArrowRightIcon className="h-4 w-4 hover:text-gray-400 max-md:hidden" />
            <div className="md:hidden">-</div>
            <div className="text-sm md:text-lg lg:text-xl md:font-bold">
              {convertTo12HourFormat(singleReturnFlight.arrivalTime).time}
              {convertTo12HourFormat(singleReturnFlight.arrivalTime).period}
            </div>
          </div>
          <div className="text-sm md:text-lg lg:text-xl font-semibold">
            ₹{singleReturnFlight.price}
          </div>
        </div>}
      </div>
      <div className="text-right flex md:gap-10 gap-2 items-center justify-center max-sm:flex-col">
        <div>
          <div className="text-sm md:text-lg lg:text-xl md:font-bold">
            ₹ {singleFlight.price + singleReturnFlight.price}
          </div>
          <div className="text-sm text-gray-400">per adult</div>
        </div>
        <div>
          <button
            className="text-sm bg-orange-400 text-white py-2 md:px-4 px-1 rounded-full shadow-md"
            onClick={handleProceed}
          >
            Choose Flights
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightSummary;
