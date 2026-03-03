import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useSearchFlights from "../../hooks/useSearchFlight";
import { getAirportId } from "../../redux/airports/airportAction";
import { Flight, setisDeparture } from "../../redux/flights/flightSlice";
import { getFlightsData } from "../../redux/flights/flightsAction";
import { AppDispatch, RootState } from "../../redux/store";
import { getCurrentTime, getDate, getTime } from "../../utils/Date";
import FlightCard from "./components/FlightCard";
import FlightSummary from "./components/FlightSummary";

const FlightSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // REDUX STATE
  const {
    departureFlight,
    returnFlight,
    departurePage,
    returnPage,
    totalDeparturePages,
    totalReturnPages,
    isDeparture,
    filterTime,
    maxPrice,
    minPrice,
    departureAirportId,
    returnAirportId,
  } = useSelector((state: RootState) => state.flight);

  const { departureCity, arrivalCity, departureDate, returnDate, passenger } =
    useSelector((state: RootState) => state.search);

  const singleFlight = useSelector((state: RootState) => state.singleFlight);
  const singleReturnFlight = useSelector(
    (state: RootState) => state.singleReturnFlight
  );

  const searchFlights = useSearchFlights();

  // STATE
  const [flightsArray, setFlightsArray] = useState<Flight[]>(departureFlight);

  // 🔹 Log initial Redux state
  console.log("🛫 Departure Flights (Redux):", departureFlight);
  console.log("🛬 Return Flights (Redux):", returnFlight);
  console.log("🟢 isDeparture:", isDeparture);

  // UPDATE FLIGHTS ARRAY WHEN DEPARTURE OR RETURN FLIGHTS CHANGE
  useEffect(() => {
    const currentFlights = isDeparture ? departureFlight : returnFlight;
    setFlightsArray(currentFlights);

    // 🔹 Log updated flightsArray
    console.log("🔄 Updated flightsArray:", currentFlights);
  }, [departureFlight, returnFlight, isDeparture]);

  // FETCH MORE FLIGHTS
  const fetchMoreFlights = async (type: "Departure" | "Return") => {
    try {
      console.log(`🚀 Fetching more ${type} flights...`);

      // Get airport IDs
      const departureCityDetails = await dispatch(getAirportId({ city: departureCity }));
      const arrivalCityDetails = await dispatch(getAirportId({ city: arrivalCity }));

      const departureAirportId = departureCityDetails.payload?.id;
      const arrivalAirportId = arrivalCityDetails.payload?.id;

      console.log("📍 Departure city:", departureCity, "Arrival city:", arrivalCity);
      console.log("🛫 Mapped DepartureAirportId:", departureAirportId);
      console.log("🛬 Mapped ArrivalAirportId:", arrivalAirportId);

      if (!departureAirportId || !arrivalAirportId) {
        console.warn("⚠️ One of the airport IDs is undefined. Aborting fetch.");
        return;
      }

      // Determine time
      const time =
        getDate(departureDate) !== getDate(new Date())
          ? "23:00"
          : getCurrentTime();
      const returnTime =
        returnDate && getDate(returnDate) !== getDate(new Date())
          ? "23:00"
          : getCurrentTime();

      const flightParams = {
        departureAirportId:
          type === "Departure" ? departureAirportId : arrivalAirportId,
        arrivalAirportId:
          type === "Departure" ? arrivalAirportId : departureAirportId,
        date: type === "Departure" ? departureDate : returnDate!,
        time: filterTime
          ? getTime(filterTime)
          : type === "Departure"
            ? time
            : returnTime,
        type,
        maxPrice,
        minPrice,
        page: type === "Departure" ? departurePage + 1 : returnPage + 1,
      };

      console.log("📝 Flight search params:", flightParams);

      const res = await dispatch(getFlightsData(flightParams));

      // 🔹 Log API response
      console.log(`📦 API Response for ${type} flights:`, res);
      console.log("🛩 Flights array returned:", res.payload?.data);

      if (!res.payload?.data || res.payload?.data.length === 0) {
        console.warn(`⚠️ No flights returned for ${type}`);
      }
    } catch (error) {
      console.error("❌ Error fetching more flights:", error);
    }
  };

  const handleViewMore = () => {
    fetchMoreFlights(isDeparture ? "Departure" : "Return");
  };

  // TOGGLE DEPARTURE / RETURN FLIGHTS
  const handleToggle = () => {
    dispatch(setisDeparture(!isDeparture));
    const searchParams = {
      departureCity,
      arrivalCity,
      departureDate,
      returnDate,
      passenger,
      filterTime,
      maxPrice,
      minPrice,
    };

    console.log("🔄 Toggling flights view, searchParams:", searchParams);

    searchFlights(searchParams);
  };

  // CHECK FLIGHT COMPATIBILITY (for return trips)
  const flightsCompatible = (): boolean => {
    if (!singleFlight.arrivalTime || !singleReturnFlight.departureTime) return true;

    const [departureHour, departureMinute] = singleFlight.arrivalTime.split(":").map(Number);
    const [returnHour, returnMinute] = singleReturnFlight.departureTime.split(":").map(Number);

    const departureDateTime = departureDate
      .add(singleFlight.nextDay, "day")
      .set("hour", departureHour)
      .set("minute", departureMinute);

    const returnDateTime = returnDate!
      .set("hour", returnHour)
      .set("minute", returnMinute);

    console.log("📅 Departure DateTime:", departureDateTime.toString());
    console.log("📅 Return DateTime:", returnDateTime.toString());

    if (departureDateTime.isAfter(returnDateTime)) return false;

    if (
      departureDateTime.isSame(returnDateTime, "day") &&
      departureDateTime.add(59, "minutes").isAfter(returnDateTime)
    )
      return false;

    return true;
  };

  const handleProceed = () => {
    if (!departureAirportId || !returnAirportId) {
      toast.error("Please select both flights to proceed.");
      return;
    }
    if (!flightsCompatible()) {
      toast.error("There should be at least 1 hour gap between both flights");
      return;
    }
    console.log("✅ Proceeding with departureId:", departureAirportId, "returnId:", returnAirportId);
    navigate(`/passenger-details/${departureAirportId}/${returnAirportId}`);
  };

  return (
    <>
      {returnDate && (
        <div className="flex justify-center my-4">
          <div className="flex bg-white w-auto rounded-full border border-gray-200 shadow-lg mb-8">
            <div
              className={`py-2 px-6 rounded-full cursor-pointer ${isDeparture ? "bg-orange-400 text-gray-100" : "text-gray-700"
                }`}
              onClick={() => handleToggle()}
            >
              Departure
            </div>
            <div
              className={`py-2 px-6 rounded-full cursor-pointer ${!isDeparture ? "bg-orange-400 text-gray-100" : "text-gray-700"
                }`}
              onClick={() => handleToggle()}
            >
              Return
            </div>
          </div>
        </div>
      )}

      <div className={`flex flex-col items-center gap-10 mx-10 ${!returnDate ? "mb-14" : "mb-36"}`}>
        {flightsArray?.length === 0 ? (
          <div className="text-gray-500 text-lg">No flights available</div>
        ) : (
          flightsArray.map((item: Flight, index: number) => (
            <FlightCard key={index} flight={item} isDeparture={isDeparture} />
          ))
        )}
        {(isDeparture
          ? departurePage < totalDeparturePages
          : returnPage < totalReturnPages) && (
            <div
              className="flex justify-center items-center h-full cursor-pointer"
              onClick={handleViewMore}
            >
              <div className="bg-white w-max py-2 px-4 rounded-full shadow-lg text-blue-500">
                View more
              </div>
            </div>
          )}
      </div>

      {returnDate && <FlightSummary handleProceed={handleProceed} />}
    </>
  );
};

export default FlightSection;