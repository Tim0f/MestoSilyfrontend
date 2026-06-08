type PartnerCardProps = {
  name: string
  image: string
  url?: string
}
export default function PartnerCard({ name, image, url }: PartnerCardProps) {
  const Wrapper: any = url ? 'a' : 'div'

  return (
    <Wrapper
      {...(url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex flex-col items-center self-start"
    >
      <div
        className="w-64 h-64 textured-round"
        style={{ '--ring-size': '20px' } as React.CSSProperties}
      >
        <div className="inner bg-customblack flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <h3 className="mt-6 text-h2 font-h2 text-customwhite max-w-[16rem] break-words text-center">
        {name}
      </h3>
    </Wrapper>
  )
}