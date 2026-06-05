import React, { useId } from 'react';

export default function TexturedBorder() {
  const filterId = useId(); // генерирует уникальный id для каждого экземпляра

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 921 1061"
      preserveAspectRatio="none"
    >
      <rect
        x="7.3"
        y="7.3"
        width="906"
        height="1046"
        fill="rgb(var(--color-customblack))"
        stroke="rgb(var(--color-customyellow))"
        strokeWidth="5"
        filter={`url(#${filterId})`}
      />

      <defs>
        <filter
          id={filterId}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0346"
            numOctaves="3"
            seed="2723"
            result="noise"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="12.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}