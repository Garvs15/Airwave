import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAirportId } from "../../redux/airports/airportAction";
import { getFlightsData } from "../../redux/flights/flightsAction";
import { setMaxPrice, setMinPrice } from "../../redux/flights/flightSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { getCurrentTime, getDate, getTime } from "../../utils/Date";

function valuetext(value: number) {
  return `${value}°C`;
}

export default function PriceFilterModal({
  priceFilter,
  setPriceFilter,
}: {
  priceFilter: boolean;
  setPriceFilter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { departureCity, arrivalCity, departureDate, returnDate } =
    useSelector((state: RootState) => state.search);
  const { isDeparture, filterTime, minPrice, maxPrice } = useSelector(
    (state: RootState) => state.flight
  );

  const [value, setValue] = React.useState<number[]>([minPrice, maxPrice]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    dispatch(setMinPrice(value[0]));
    dispatch(setMaxPrice(value[1]));
  };

  const handleClose = () => {
    setPriceFilter(false);
  };

  const fetchMoreFlights = async (type: "Departure" | "Return") => {
    try {
      const departureCityDetails = await dispatch(
        getAirportId({ city: departureCity })
      );
      const arrivalCityDetails = await dispatch(
        getAirportId({ city: arrivalCity })
      );

      const departureAirportId = departureCityDetails.payload.id;
      const arrivalAirportId = arrivalCityDetails.payload.id;

      let time1 = getCurrentTime();
      let time2 = getCurrentTime();

      time1 = getDate(departureDate) !== getDate(new Date()) ? "23:00" : time1;
      time2 =
        returnDate && getDate(returnDate) !== getDate(new Date())
          ? "23:00"
          : time2;

      const flightParams = {
        departureAirportId:
          type === "Departure" ? departureAirportId : arrivalAirportId,
        arrivalAirportId:
          type === "Departure" ? arrivalAirportId : departureAirportId,
        date: type === "Departure" ? departureDate : returnDate!,
        time: filterTime
          ? getTime(filterTime)
          : type === "Departure"
          ? time1
          : time2,
        type,
        page: 1,
        minPrice: value[0],
        maxPrice: value[1],
      };

      await dispatch(getFlightsData(flightParams));

    } catch (error) {
      console.error("Error fetching more flights:", error);
    }
  };

  const applyFilter = () => {
    handleClose();
    dispatch(setMinPrice(value[0]));
    dispatch(setMaxPrice(value[1]));
    fetchMoreFlights(isDeparture ? "Departure" : "Return");
  };

  const resetFilter = () => {
    setValue([2000, 50000])
    dispatch(setMinPrice(2000));
    dispatch(setMaxPrice(50000));
  }

  return (
    <Dialog open={priceFilter} onClose={handleClose}>
      <DialogTitle>Adjust Price Range</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 300 }}>
          <Typography gutterBottom>
            Current Price Range: ₹{value[0]} - ₹{value[1]}
          </Typography>
          <Slider
            getAriaLabel={() => "Price range"}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            min={2000}
            max={50000}
            step={100}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={resetFilter}>Reset</Button>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={applyFilter}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
