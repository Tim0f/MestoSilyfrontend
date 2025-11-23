import AudioPlayer from './AudioPlayer'
import texturedRound from '../../assets/svg/texturedRound.svg'

type CardProps = {
  Image: string
  name: string
  position: string
  audiosrc: string
  onPlayChange?: (isPlaying: boolean) => void
}

export default function TeamCard({ Image, name, position, audiosrc, onPlayChange }: CardProps) {
  return (
    <div className="p-6 w-[590px] flex flex-col items-center text-customwhite">
      <div className="relative w-[590px] h-[590px] rounded-full border-2 border-customyellow flex items-center justify-center p-6 mb-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backgroundImage: `url(${texturedRound})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 z-10 rounded-full bg-gradient-to-br from-primary-800/20 to-transparent" />
        <div className="relative z-30 w-[537px] h-[537px] rounded-full overflow-hidden">
          <img src={Image} alt={name} className="object-cover w-full h-full" />
        </div>
      </div>

      <div className="text-p font-p text-center">{position}</div>
      <div className="font-h1 text-h2 font-h2 text-center">{name}</div>
      <AudioPlayer src={audiosrc} onPlayChange={onPlayChange} />
    </div>
  )
}
