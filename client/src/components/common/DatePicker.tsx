import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { RiFlightLandLine } from "react-icons/ri";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import React from "react";

const BasicDatePicker: React.FC<{
  minDate: Dayjs;
  onChange: (date: Dayjs | null) => void;
  value: Dayjs | null;
  type: "departure" | "return";
}> = ({ minDate, onChange, value, type }) => {
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      onChange(date);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        onChange={handleDateChange}
        slots={{ openPickerIcon: type === "departure" ? FlightTakeoffIcon : RiFlightLandLine }}
        format="DD MMMM YYYY"
        minDate={minDate}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
