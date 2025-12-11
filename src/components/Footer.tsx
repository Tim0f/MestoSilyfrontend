import { Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-customgrey text-customyellow px-10 py-16">
      <div className="max-w-[1600px] mx-auto flex justify-between items-start">

        {/* Левый блок */}
        <div className="flex flex-col">
          <h2 className="text-4xl font-h2 mb-3">
            Где мы находимся:
          </h2>
          <p className="text-xl mb-6">г.Москва Партийный переулок, 1к10</p>

          <iframe
  src="https://yandex.ru/map-widget/v1/?ll=37.632925%2C55.719176&z=17&pt=37.632925,55.719176"
  width="650"
  height="500"
  frameBorder="0"
  className="rounded-lg"
></iframe>

        </div>

        {/* Правый блок */}
        <div className="flex flex-col items-end text-right gap-6">

          <div className="flex items-center gap-6">
            <Send className="w-10 h-10 text-[#F4C884] rotate-[-15deg] cursor-pointer" />
          </div>

          <div className="flex flex-col gap-1 text-[#F4C884] text-xl">
            <a href="mailto:mestosily@gmail.com" className="hover:opacity-70">
              mestosily@gmail.com
            </a>
            <a href="tel:+79269887798" className="hover:opacity-70">
              +7 926 988 77 98
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
