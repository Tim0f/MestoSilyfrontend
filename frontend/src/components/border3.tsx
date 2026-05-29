import React from "react";

interface Border3Props {
  className?: string;
  children?: React.ReactNode;
}

// Компонент с таким же "волнистым" путём как на изображении
// Путь взят вручную и имитирует неровные края
export default function Border3({ className = "", children }: Border3Props) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d="M40 80
             Q120 40 250 60
             T500 55
             T750 60
             T960 80
             Q980 200 960 350
             T955 650
             Q960 800 960 900
             Q750 940 500 930
             Q250 940 40 900
             Q20 700 40 500
             Q20 300 40 80Z"
         
        />
      </svg>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}