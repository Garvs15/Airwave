import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";

interface PassengerClassProps {
  setPassenger: (passenger: number) => void;
  setPopup: (popup: boolean) => void;
  passenger: number;
}

const PassengerClass: React.FC<PassengerClassProps> = ({
  setPassenger,
  setPopup,
  passenger,
}) => {
  const [selectedPassenger, setSelectedPassenger] = useState<number>(passenger);
  const popupRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (popupRef.current && backdropRef.current) {
      gsap.fromTo(
        popupRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 }
      );
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        animateClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const animateClose = () => {
    if (popupRef.current) {
      gsap.to(popupRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setPopup(false),
      });
    }
    if (backdropRef.current) {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 });
    }
  };

  const handleApply = () => {
    setPassenger(selectedPassenger);
    animateClose();
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50"
    >
      <div
        className="rounded-xl shadow-lg bg-white border p-6 w-[350px]"
        ref={popupRef}
      >
        <div>
          <div className="font-semibold text-xl mb-4">Select Passengers</div>
          <div className="flex flex-wrap gap-2 border p-2 rounded-md justify-center">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                className={`px-4 py-2 rounded-md cursor-pointer transition duration-200 ${
                  selectedPassenger === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-100"
                }`}
                key={i + 1}
                onClick={() => setSelectedPassenger(i + 1)}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        <button
          className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 rounded transition duration-200"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PassengerClass;
