import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import React, { useState } from "react";
import TimePickerModal from "../common/TimePickerModal";
import PriceFilterModal from "../common/PriceFilterModal";

const filterOptions = [
  {
    icon: <AccessTimeIcon style={{ color: "blue" }} fontSize="small" />,
    label: "Time",
  },
  {
    icon: <CurrencyRupeeIcon style={{ color: "blue" }} fontSize="small" />,
    label: "Price",
  },
];

const Filter = () => {
  const [timeFilter, setTimeFilter] = useState(false);
  const [priceFilter, setPriceFilter] = useState(false);

  return (
    <div className="flex justify-center items-center w-[100%] my-8">
      <div className="flex gap-5 bg-white justify-center items-center min-w-max rounded-full py-2 px-4">
        {filterOptions.map((option, index) => (
          <div className="flex gap-3 items-center" key={index}>
            <div className="flex gap-1 justify-center items-center">
              {option.icon}
              <div>{option.label}</div>
            </div>
            <KeyboardArrowDownOutlinedIcon
              fontSize="small"
              onClick={() => {
                option.label === "Time"
                  ? setTimeFilter(true)
                  : setPriceFilter(true);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
        ))}
      </div>
      {timeFilter && (
        <TimePickerModal timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      )}
      {priceFilter && (
        <PriceFilterModal priceFilter={priceFilter} setPriceFilter={setPriceFilter} />  
      )}
    </div>
  );
};

export default Filter;
