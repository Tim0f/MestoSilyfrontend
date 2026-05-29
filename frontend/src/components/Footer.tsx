import { Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-customgrey text-customyellow px-4 md:px-10 py-10 md:py-16">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-10">

        {/* Левый блок */}
        <div className="flex flex-col w-full md:w-auto">
          <h2 className="text-2xl md:text-4xl font-h2 mb-3">
            Где мы находимся:
          </h2>

          <p className="text-sm md:text-xl mb-4 md:mb-6">
            г.Москва Партийный переулок, 1к10
          </p>

          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=37.632925%2C55.719176&z=17&pt=37.632925,55.719176"
            width="650"
            height="500"
            frameBorder="0"
            className="
              w-full 
              h-[250px] md:h-[500px] 
              rounded-lg
            "
          ></iframe>
        </div>

        {/* Правый блок */}
        <div className="
          flex flex-col 
          items-start md:items-end 
          text-left md:text-right 
          gap-6 
          w-full md:w-auto
        ">

          <div className="flex items-center gap-6">
            <Send className="w-8 h-8 md:w-10 md:h-10 text-customyellow rotate-[-15deg] cursor-pointer" />
          </div>

          <div className="flex flex-col gap-1 text-customyellow text-sm md:text-xl">
            <a href="mailto:mestosily@gmail.com" className="hover:opacity-70 break-all">
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