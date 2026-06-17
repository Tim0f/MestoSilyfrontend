export default function NewsBorder() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 610 542"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="newsTexture" x="-10%" y="-10%" width="120%" height="120%">
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

      <rect
        x="7.3"
        y="7.3"
        width="595"
        height="527"
        fill="none"
        stroke="rgb(var(--color-customyellow))"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        filter="url(#newsTexture)"
      />
    </svg>
  )
}