import React, { useState } from "react";
import { Airplane } from "../../redux/airports/airportSlice";
import CitySelectModal from "./CitySelectModal";

interface CustomSelectCityProps {
  value: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: Airplane[];
}

const CustomSelectCity: React.FC<CustomSelectCityProps> = ({
  value,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCityClick = (city: string) => {
    const event: React.ChangeEvent<HTMLInputElement> = {
      target: {
        value: city,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
    toggleDropdown();
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="w-full cursor-pointer text-sm" onClick={toggleDropdown}>
          {value ? value : "Select City"}
        </div>
      </div>
      {isOpen && <CitySelectModal setIsOpen={setIsOpen} handleCityClick={handleCityClick} options={options} />}
    </div>
  );
};

export default CustomSelectCity;
