import React from 'react'

const TimeInfo = ({
  day,
  time,
  period,
  location,
}: {
  day: string;
  time: string;
  period: string;
  location: string;
}) => (
  <div>
    <div className="text-sm">{day}</div>
    <div className="flex text-2xl max-sm:text-lg font-semibold gap-2">
      <div>{time}</div>
      <div className="text-gray-400">{period}</div>
    </div>
    <div className="text-sm max-xs:text-xs">{location}</div>
  </div>
);

export default TimeInfo