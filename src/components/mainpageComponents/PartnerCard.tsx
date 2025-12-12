// PartnerCard.tsx

type PartnerCardProps = {
  name: string
  image: string
  url?: string
  texturedRound: string
}

export default function PartnerCard({ name, image, url, texturedRound }: PartnerCardProps) {
  const Wrapper: any = url ? 'a' : 'div'

  return (
    <Wrapper
      {...(url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="relative flex flex-col items-center group transition-transform hover:scale-105"
    >
      <div className="relative w-64 h-64 rounded-full overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            backgroundImage: `url(${texturedRound})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="relative z-30 flex h-full w-full items-center justify-center bg-black/20">
          <img
            src={image}
            alt={name}
            className="w-48 h-48 rounded-full object-cover"
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-h2 font-h2 text-customwhite whitespace-pre-line">
          {name}
        </h3>
      </div>
    </Wrapper>
  )
}
