export default function StatusBorder() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 940 399"
      preserveAspectRatio="none"
    >
      <g filter="url(#filter0_g)">
        <rect
          x="16.8"
          y="16.8"
          width="906"
          height="365"
          fill="#F4C884"
          stroke="none"
          strokeWidth="2"
        />
      </g>

      <defs>
        <filter
          id="filter0_g"
          x="0"
          y="0"
          width="939.6"
          height="398.6"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />

          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01675"
            numOctaves="3"
            seed="2723"
          />

          <feDisplacementMap
            in="shape"
            scale="31.6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displacedImage"
          />

          <feMerge>
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}