import React, { useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import PassengerClass from "./PassengerClass";

interface PassengerProps {
  passenger: number;
  setPassenger: (value: number) => void;
}

const Passenger: React.FC<PassengerProps> = ({
  passenger,
  setPassenger,
}) => {
  const [popup, setPopup] = useState<boolean>(false);

  return (
    <div className="flex justify-center cursor-pointer items-center gap-4 border p-3 rounded-xl">
      <div className="border rounded-full p-3 flex justify-center">
        <IoPersonOutline />
      </div>
      <div onClick={() => setPopup(true)}>
        <div className="flex text-xs gap-1">
          <div>Passenger</div>
        </div>
        <div className="flex gap-1 text-sm">
          <div>{passenger} Passengers</div>
        </div>
      </div>
      {popup && (
        <PassengerClass
          setPassenger={setPassenger}
          setPopup={setPopup}
          passenger={passenger}
        />
      )}
    </div>
  );
};

export default Passenger;
