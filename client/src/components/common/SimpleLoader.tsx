import React from "react";
import { ClipLoader } from "react-spinners";

const SimpleLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <ClipLoader color="#24efbf" />
    </div>
  );
};

export default SimpleLoader;
