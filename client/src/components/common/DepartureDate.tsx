import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { getDate } from "../../utils/Date";
import DatePickerModal from "./DatePickerModal";

interface DepartureDateProps {
  departureDate: Dayjs | null;
  setDepartureDate: (date: Dayjs) => void;
}

const DepartureDate: React.FC<DepartureDateProps> = ({
  departureDate,
  setDepartureDate,
}) => {
  const minDate = dayjs(new Date());

  const [departureModalOpen, setDepartureModalOpen] = useState(false);

  const handleDepartureDateChange = (date: any) => {
    setDepartureDate(date);
  };

  return (
    <div className="border p-3 rounded-xl flex gap-2 justify-evenly items-center">
      <div className="border rounded-full p-3 flex justify-center">
        <i className="fa-solid fa-calendar-days"></i>
      </div>
      <div className="space-y-1">
        <div className="text-xs">Departure</div>
        <div
          className="cursor-pointer"
          onClick={() => setDepartureModalOpen(true)}
        >
          {getDate(departureDate)}
        </div>
      </div>
      <DatePickerModal
        open={departureModalOpen}
        handleClose={() => setDepartureModalOpen(false)}
        selectedDate={departureDate}
        handleDateChange={handleDepartureDateChange}
        title="Select Departure Date"
        minDate={minDate}
      />
    </div>
  );
};

export default DepartureDate;
