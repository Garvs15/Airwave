import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { getDate } from "../../utils/Date";
import DatePickerModal from "./DatePickerModal";
import gsap from "gsap";

interface ReturnDateProps {
  returnDate: Dayjs | null;
  setReturnDate: (date: Dayjs | null) => void;
}

const ReturnDate: React.FC<ReturnDateProps> = ({
  returnDate,
  setReturnDate,
}) => {
  const minDate: Dayjs = dayjs(new Date());
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [isReturn, setIsReturn] = useState<boolean>(!!returnDate);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleReturnDateChange = (date: Dayjs | null) => {
    setReturnDate(date);
  };

  const handleOneWay = () => {
    // Animate the switch to "One Way"
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setReturnDate(null);
          setIsReturn(false);
          gsap.to(containerRef.current, { opacity: 1, duration: 0.3 });
        },
      });
    }
  };

  const handleReturnWay = () => {
    // Animate the switch to "Return"
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          setReturnDate(dayjs(new Date()));
          setIsReturn(true);
          gsap.to(containerRef.current, { opacity: 1, duration: 0.3 });
        },
      });
    }
  };

  useEffect(() => {
    if (returnModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [returnModalOpen]);

  return (
    <div ref={containerRef}>
      {!isReturn ? (
        <div
          className="border p-3 rounded-xl flex gap-2 cursor-pointer justify-center items-center h-full"
          onClick={handleReturnWay}
        >
          <div className="border rounded-full p-3 flex justify-center">
            <i className="fa-solid fa-calendar-days"></i>
          </div>
          <div>
            <div>Return</div>
            <div className="text-xs">Tap to add return date</div>
          </div>
        </div>
      ) : (
        <div className="border p-3 rounded-xl flex gap-2 items-center w-auto">
          <div className="border rounded-full p-3 flex justify-center">
            <i className="fa fa-calendar-days"></i>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <div className="text-xs">Return</div>
              <div
                className="text-xs text-blue-400 cursor-pointer"
                onClick={handleOneWay}
              >
                One Way
              </div>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setReturnModalOpen(true)}
            >
              {getDate(returnDate)}
            </div>
          </div>
        </div>
      )}

      <DatePickerModal
        ref={modalRef}
        open={returnModalOpen}
        handleClose={() => setReturnModalOpen(false)}
        selectedDate={returnDate}
        handleDateChange={handleReturnDateChange}
        title="Select Return Date"
        minDate={minDate}
      />
    </div>
  );
};

export default ReturnDate;
