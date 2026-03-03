import React from "react";
import toast from "react-hot-toast";

const SocialLogin = () => {
  return (
    <div className="social flex flex-col space-y-4 w-[90%] sm:w-[65%] mmd:w-[50%] md:w-[80%] lg:w-[70%] llg:w-[55%]">
      <button
        className="text-gray-700 font-medium py-2 px-4 rounded-md flex items-center justify-center bg-[#F7FBFF]"
        type="button"
        onClick={() => {
          window.location.href = `${process.env.REACT_APP_BACKEND_AUTH_API}/google`;
        }}
      >
        <img
          src={require("../../assets/google.png")}
          alt="Google"
          className="mr-2 h-6"
        />
        Sign in with Google
      </button>
      <button
        className="text-gray-700 font-medium py-2 px-4 rounded-md flex items-center justify-center bg-[#F7FBFF]"
        type="button"
        onClick={() => toast("Coming soon")}
      >
        <img
          src={require("../../assets/facebook.png")}
          alt="Facebook"
          className="mr-2 h-6"
        />
        Sign in with Facebook
      </button>
    </div>
  );
};

export default SocialLogin;
