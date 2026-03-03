import React from "react";

const OrderDetailsCard = ({passenger, baseFare} : {passenger: number, baseFare: number}) => {

  const totalFare = baseFare*passenger;
  const tax = totalFare*0.10;

  const finalAmount = totalFare + tax;

  return (
    <div className="bg-white w-[50%] max-lg:w-[70%] max-md:w-[90%] rounded-md">
      <div className="border-b justify-center flex py-6 items-center text-lg font-semibold">
        Fare Summary
      </div>
      <div className="flex-wrap flex justify-evenly items-center shadow-inner py-6 gap-y-2">
        <div className="w-[80%] flex justify-between items-center">
          <span className="font-medium">Total Passengers:</span>
          <span>{passenger}</span>
        </div>
        <div className="w-[80%] flex justify-between items-center">
          <span className="font-medium">Base Fare:</span>
          <span>₹{totalFare}</span>
        </div>
        <div className="w-[80%] flex justify-between items-center">
          <span className="font-medium">Taxes:</span>
          <span>₹{tax}</span>
        </div>
        <div className="border w-[80%] border-gray-100" />
        <div className="w-[80%] flex justify-between items-center">
          <span className="font-medium">Total:</span>
          <span>₹{finalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsCard;
