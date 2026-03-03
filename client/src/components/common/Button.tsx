import React from 'react'

const Button = ({ onClick, children }: any) => (
  <button
    onClick={onClick}
    className="h-full w-full cursor-pointer text-gray-100 flex justify-center items-center gap-1 border p-3 bg-orange-400 rounded-xl"
  >
    {children}
  </button>
);

export default Button