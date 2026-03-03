import React, { useState } from "react";

interface ImageProps {
  src: string;
  alt: string;
}

const Image = React.memo(({ src, alt }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="hidden md:w-1/2 md:flex items-center justify-center relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[95%] w-[95%] rounded-xl bg-gray-200 animate-pulse" />
        </div>
      )}
      <img
        src={src}
        className={`h-[95%] w-[95%] object-cover rounded-xl transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
});

export default Image;
