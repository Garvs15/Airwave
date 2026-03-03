import React, { useEffect } from "react";
import { GiAirplaneArrival, GiAirplaneDeparture } from "react-icons/gi";
import { GoArrowSwitch } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import { getAllAirports } from "../../redux/airports/airportAction";
import { AppDispatch, RootState } from "../../redux/store";
import { calculateDistance } from "../../utils/calculateDistance";
import CustomSelectCity from "./CustomSelectCity";

interface CitySelectProps {
  departureCity: string | null;
  setDepartureCity: (city: string) => void;
  arrivalCity: string | null;
  setArrivalCity: (city: string) => void;
}

interface Airport {
  id: number;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
}

const CitySelect: React.FC<CitySelectProps> = ({
  departureCity,
  setDepartureCity,
  arrivalCity,
  setArrivalCity,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { location } = useCurrentLocation();
  const { airports } = useSelector((state: RootState) => state.airport);

  useEffect(() => {
    dispatch(getAllAirports());
  }, [dispatch]);

  useEffect(() => {
    const savedCity = sessionStorage.getItem("departureCity");
    if (
      !savedCity &&
      location.latitude &&
      location.longitude &&
      airports.length
    ) {
      const nearestAirport = airports.reduce<{
        airport: Airport | null;
        distance: number;
      }>(
        (closest: any, airport: any) => {
          const distance = calculateDistance(
            location.latitude!,
            location.longitude!,
            airport.latitude,
            airport.longitude,
            "K"
          );
          return distance < closest.distance ? { airport, distance } : closest;
        },
        { airport: null, distance: Infinity }
      );

      if (nearestAirport.airport) {
        setDepartureCity(nearestAirport.airport.city);
        sessionStorage.setItem(
          "departureCity",
          JSON.stringify(nearestAirport.airport)
        );
      }
    }
  }, [airports, location, setDepartureCity]);

  const handleDepartureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepartureCity(event.target.value);
  };

  const handleArrivalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setArrivalCity(event.target.value);
  };

  return (
    <div className="flex flex-1 h-full max-sm:flex-col justify-around items-center gap-5 border p-3 rounded-xl">
      <div className="flex gap-3 items-center">
        <div className="bg-orange-400 text-white rounded-full text-xl p-2 flex justify-center items-center">
          <GiAirplaneDeparture />
        </div>
        <div className="flex flex-col w-full">
          <div className="text-xs">Departure City</div>
          <CustomSelectCity
            value={departureCity}
            onChange={handleDepartureChange}
            options={airports}
          />
        </div>
      </div>
      <div className="border rounded-full p-2">
        <GoArrowSwitch />
      </div>
      <div className="flex gap-3 items-center">
        <div className="bg-orange-400 text-white rounded-full text-xl p-2 flex justify-center items-center">
          <GiAirplaneArrival />
        </div>
        <div className="flex flex-col w-full">
          <div className="text-xs">Arrival City</div>
          <CustomSelectCity
            value={arrivalCity}
            onChange={handleArrivalChange}
            options={airports}
          />
        </div>
      </div>
    </div>
  );
};

export default CitySelect;
