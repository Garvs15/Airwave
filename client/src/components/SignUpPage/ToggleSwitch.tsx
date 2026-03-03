import React from "react";

interface Props {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  toggleAuthMode: () => void;
}

const ToggleSwitch = ({ isLogin, setIsLogin, toggleAuthMode }: Props) => {
  return (
    <div className="toggle flex items-center justify-center mb-6 h-[20%]">
      <div className="bg-gray-200 p-1 rounded-full flex items-center w-full max-w-xs relative overflow-hidden">
        <div className="w-1/2 flex justify-center items-center">
          <div className="button_in absolute h-[80%] w-[48%] bg-black rounded-full transition-transform"></div>
          <button
            onClick={() => {
              setIsLogin(true);
              !isLogin && toggleAuthMode();
            }}
            className="z-10 py-2 px-4 rounded-full text-white text_in"
          >
            Sign In
          </button>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <button
            onClick={() => {
              setIsLogin(false);
              isLogin && toggleAuthMode();
            }}
            className="z-10 py-2 px-4 rounded-full text_out"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
