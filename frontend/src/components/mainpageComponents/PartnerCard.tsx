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
      className="flex flex-col items-center"
    >
      <div
        className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 textured-round"
        style={{ '--ring-size': '14px' } as React.CSSProperties}
      >
        <div className="inner bg-customblack flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <h3 className="mt-4 sm:mt-6 text-h2 font-h2 text-customwhite max-w-[16rem] break-words text-center">
        {name}
      </h3>
    </Wrapper>
  )
}