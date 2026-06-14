// TeamCard.tsx
type CardProps = {
  Image: string
  name: string
  position: string
  audiosrc: string
  onPlayChange?: (isPlaying: boolean) => void
}

export default function TeamCard({ Image, name, position }: CardProps) {
  return (
    <div className="p-4 md:p-6 w-full max-w-[590px] flex flex-col items-center text-customwhite">
      <div className="relative w-full aspect-square md:w-[590px] md:h-[590px] mb-6">
        {/* Фото */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-[75%] sm:w-[80%] aspect-square md:w-[537px] md:h-[537px] rounded-full overflow-hidden">
            <img
              src={Image}
              alt={name}
              className="object-cover w-full h-full"
            />
          </div>
        </div>

        {/* Рваная рамка с динамическим цветом */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20"
          style={{
            backgroundColor: 'rgb(var(--color-customyellow))',
            WebkitMaskImage: 'url(/svg/texturedRound.svg)',
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            maskImage: 'url(/svg/texturedRound.svg)',
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
          }}
        />
      </div>

      <div className="text-sm md:text-p font-p text-center">{position}</div>
      <div className="text-xl md:text-h2 font-h2 text-center">{name}</div>
    </div>
  )
}