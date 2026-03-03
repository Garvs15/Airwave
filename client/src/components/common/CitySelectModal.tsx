import React, { useEffect, useRef, useState } from "react";
import { GiAirplaneDeparture } from "react-icons/gi";
import { Airplane } from "../../redux/airports/airportSlice";
import gsap from "gsap";

interface CitySelectModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCityClick: (city: string) => void;
  options: Airplane[];
}

const CitySelectModal: React.FC<CitySelectModalProps> = ({
  setIsOpen,
  handleCityClick,
  options,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter((option) =>
    option.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        animateClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      dropdownRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    );
  }, []);

  const animateClose = () => {
    gsap.to(dropdownRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => setIsOpen(false),
    });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 });
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10"
    >
      <div
        ref={dropdownRef}
        className="w-[320px] bg-white border rounded-lg shadow-xl p-4"
      >
        <input
          type="text"
          placeholder="Search City"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full border-b-2 border-gray-300 px-3 py-2 text-sm 
             focus:outline-none focus:border-black focus:ring-0"
        />

        <div className="mt-2 h-[200px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.city}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleCityClick(option.city)}
              >
                <GiAirplaneDeparture className="text-blue-500" />
                <span className="text-sm">{option.city}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No airport found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitySelectModal;
