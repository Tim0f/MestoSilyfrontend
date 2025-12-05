import { ReactNode } from "react";

interface Border2Props {
  className?: string;
  children?: ReactNode;
}

export default function Border2({ className, children }: Border2Props) {
  return (
    <div className={`relative w-[111px] h-[99px] ${className}`}>
      {/* SVG-фон (вектор, можно красить через currentColor) */}
      <svg
        viewBox="0 0 111 99"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="
          M103.73 8.21
          L100.16 5.51
          L60.09 4.10
          L51.67 8.34
          L10.97 6.03
          L5.36 22.19
          L6.12 46.94
          L3.44 56.68
          L9.06 90.54
          L54.10 90.28
          L69.92 94.13
          L88.16 93.99
          L102.32 90.28
          L102.58 76.81
          L107.04 65.66
          L103.09 40.78
          Z"
          strokeWidth="2"
        />
      </svg>

      {/* Контент поверх SVG */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
