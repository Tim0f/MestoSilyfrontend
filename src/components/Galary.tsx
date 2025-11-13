import Sticker from '../assets/img/sticker.webp'

export default function SideStickers() {
  return (
    <>
      {/* Левая сторона */}
      <div className="absolute left-0 flex flex-col justify-between h-[500px]">
        <div className="flex items-center justify-center">
          <img
            src={Sticker}
            alt="left top sticker"
            className="w-[180px] h-[120px] object-cover opacity-30 mb-4"
          />
        </div>
        <div className="flex items-center justify-center">
          <img
            src={Sticker}
            alt="left middle sticker"
            className="w-[180px] h-[120px] object-cover opacity-30 mb-4"
          />
        </div>
        <div className="flex items-center justify-center">
          <img
            src={Sticker}
            alt="left bottom sticker"
            className="w-[180px] h-[120px] object-cover opacity-30 mb-4"
          />
        </div>
        <div className="flex items-center justify-center">
          <img
            src={Sticker}
            alt="left last sticker"
            className="w-[180px] h-[120px] object-cover opacity-30"
          />
        </div>
      </div>

      {/* Правая сторона (зеркальная копия) */}
      <div className="absolute right-0 flex flex-col justify-between h-[500px]">
        <div className="flex items-center justify-center">
          <img
            src={Sticker}
            alt="right top sticker"
            className="w-[180px] h-[120px] object-cover opacity-30 mb-4"
          />
        </div>
        <div className="flex items-center justify-center">
          <img
            src={Sticker}
            alt="right middle sticker"
            className="w-[180px] h-[120px] object-cover opacity-30 mb-4"
          />
        </div>
        <div className="flex items-center justify-center">
          <img
            src={Sticker}
            alt="right bottom sticker"
            className="w-[180px] h-[120px] object-cover opacity-30 mb-4"
          />
        </div>
        <div className="flex items-center justify-center">
          <img
            src={Sticker}
            alt="right last sticker"
            className="w-[180px] h-[120px] object-cover opacity-30"
          />
        </div>
      </div>
    </>
  )
}
