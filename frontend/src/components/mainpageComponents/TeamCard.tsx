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
      <div className="relative w-full aspect-square md:w-[590px] md:h-[590px] rounded-full flex items-center justify-center mb-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backgroundImage: 'url(/svg/texturedRound.svg)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="absolute inset-0 z-10 rounded-full" />

        <div className="relative z-30 w-[85%] aspect-square md:w-[537px] md:h-[537px] rounded-full overflow-hidden">
          <img
            src={Image}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="text-sm md:text-p font-p text-center">{position}</div>
      <div className="text-xl md:text-h2 font-h2 text-center">{name}</div>
    </div>
  )
}