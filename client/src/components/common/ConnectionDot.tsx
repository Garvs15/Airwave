import React from 'react'
import { GiAirplaneDeparture } from 'react-icons/gi';

const ConnectionDot = ({ time }: { time: string }) => (
  <div className="text-center space-y-1">
    <div className="text-xs">{time}</div>
    <div className="flex items-center justify-center">
      <div className="w-[10px] h-[10px] rounded-full border border-blue-500 max-sm:hidden" />
      <div className="border max-lg:w-[50px] w-[100px] border-dashed h-[0] max-sm:hidden" />
      <div>
        <div className="text-blue-500 border border-blue-500 rounded-full text-lg p-2 max-xs:p-1 flex justify-center items-center">
          <GiAirplaneDeparture />
        </div>
      </div>
      <div className="border max-lg:w-[50px] w-[100px] border-dashed h-[0] max-sm:hidden" />
      <div className="w-[10px] h-[10px] rounded-full bg-blue-500 max-sm:hidden" />
    </div>
    <div className="text-xs">Direct</div>
  </div>
);

export default ConnectionDot