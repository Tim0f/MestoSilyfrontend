type CardProps = {
  Image: string
  name: string
  position: string
  audiosrc: string
  onPlayChange?: (isPlaying: boolean) => void
}

export default function TeamCard({ Image, name, position }: CardProps) {
  return (
    <div className="p-6 w-[590px] flex flex-col items-center text-customwhite">
      <div className="relative w-[590px] h-[590px] rounded-full flex items-center justify-center p-6 mb-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backgroundImage: 'url(/svg/texturedRound.svg)', // ← ЕДИНСТВЕННОЕ ИЗМЕНЕНИЕ
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="absolute inset-0 z-10 rounded-full" />

        <div className="relative z-30 w-[537px] h-[537px] rounded-full overflow-hidden">
          <img
            src={Image}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="text-p font-p text-center">{position}</div>
      <div className="text-h2 font-h2 text-center">{name}</div>
    </div>
  )
}
