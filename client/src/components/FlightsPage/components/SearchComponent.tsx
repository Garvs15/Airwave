import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
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

const SearchComponent = () => {
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

  const handleSearchFlight = async () => {
    try {
      searchFlights(searchParams);
    } catch (error) {
      toast.error("An error occurred while searching for flights");
      console.error(error);
    }
  };

  return (
    <div className="w-[100%] py-4 px-1 flex flex-wrap justify-center items-stretch gap-6 mx-1">
      <div className="min-sm:flex-1">
        <CitySelect
          departureCity={searchParams.departureCity}
          setDepartureCity={(value) => handleInputChange("departureCity", value)}
          arrivalCity={searchParams.arrivalCity}
          setArrivalCity={(value) => handleInputChange("arrivalCity", value)}
        />
      </div>
      <DepartureDate
        departureDate={searchParams.departureDate}
        setDepartureDate={(value: Dayjs) => handleInputChange("departureDate", value)}
      />
      <ReturnDate
        returnDate={searchParams.returnDate}
        setReturnDate={(value) => handleInputChange("returnDate", value)}
      />
      <Passenger
        passenger={searchParams.passenger}
        setPassenger={(value: number) => handleInputChange("passenger", value)}
      />
      <div>
        <Button
          onClick={() => handleSearchFlight()}
        >
          Search Flights <CiSearch size="30px" />
        </Button>
      </div>
    </div>
  );
};

export default SearchComponent;
