import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useSearchFlights from "../../../hooks/useSearchFlight";
import { RootState } from "../../../redux/store";
import Button from "../../common/Button";
import CitySelect from "../../common/CitySelect";
import DepartureDate from "../../common/DepartureDate";
import Passenger from "../../common/Passenger";
import ReturnDate from "../../common/ReturnDate";

interface SearchParams {
  departureCity: string;
  arrivalCity: string;
  departureDate: Dayjs;
  returnDate: Dayjs | null;
  passenger: number;
}

const SearchFlight: React.FC = () => {
  const navigate = useNavigate();

  const { departureCity, arrivalCity, departureDate, returnDate, passenger } =
    useSelector((state: RootState) => state.search);

  const searchFlights = useSearchFlights();

  const [searchParams, setSearchParams] = useState<SearchParams>({
    departureCity: departureCity || "",
    arrivalCity: arrivalCity || "",
    departureDate: departureDate || dayjs(new Date()),
    returnDate: returnDate || null,
    passenger: passenger || 1,
  });

  const handleInputChange = (name: keyof SearchParams, value: any) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearchFlight = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await searchFlights(searchParams);
      if (res) {
        navigate("/search-flights");
      }
    } catch (error) {
      toast.error("An error occurred while searching for flights");
      console.error(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedItem = sessionStorage.getItem("departureCity");
      if (storedItem) {
        const departureCityFromStorage = JSON.parse(storedItem);
        if (departureCityFromStorage?.city && !searchParams.departureCity) {
          handleInputChange("departureCity", departureCityFromStorage.city);
          clearInterval(intervalId);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [searchParams.departureCity]);

  return (
    <div className="bg-[#fffffff0] p-4 space-y-5 rounded-2xl search-flight-main">
      <div className="ml-2">
        <i className="fa-solid fa-plane"></i> Search Flights
      </div>
      <div className="flex flex-wrap gap-3 justify-between search-flight">
        <div className="min-sm:flex-1">
          <CitySelect
            departureCity={searchParams.departureCity}
            setDepartureCity={(value) =>
              handleInputChange("departureCity", value)
            }
            arrivalCity={searchParams.arrivalCity}
            setArrivalCity={(value) => handleInputChange("arrivalCity", value)}
          />
        </div>
        <div>
          <DepartureDate
            departureDate={searchParams.departureDate}
            setDepartureDate={(value: any) =>
              handleInputChange("departureDate", value)
            }
          />
        </div>
        <div>
          <ReturnDate
            returnDate={searchParams.returnDate}
            setReturnDate={(value) => handleInputChange("returnDate", value)}
          />
        </div>
        <div>
          <Passenger
            passenger={searchParams.passenger}
            setPassenger={(value) => handleInputChange("passenger", value)}
          />
        </div>
        <div>
          <Button onClick={handleSearchFlight}>
            Search Flights <CiSearch size="30px" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFlight;
