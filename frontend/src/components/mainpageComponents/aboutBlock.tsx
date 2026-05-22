import aboutImage from '../../assets/img/about.png'
import Mask2 from '../../assets/img/Mask2.png'

const stats = [
  { value: '5', label: 'событий в месяц' },
  { value: '12', label: 'направлений' },
  { value: '1', label: 'уютная площадка' },
  { value: '26', label: 'наставников' },
]

export default function AboutBlock() {
  return (
    <section className="py-20 flex justify-center items-center bg-customblack">
      <div className="pl-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="mb-8 text-h1 font-h1 text-customyellow">О НАС</h2>
            <p className="text-customwhite font-p text-p mb-12 leading-relaxed">
              «Место Силы» — это сообщество единомышленников, где каждый найдет занятие по душе.
              Мы создаем пространство для творчества, спорта и общения.
            </p>
<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
  {stats.map((stat) => (
    <div key={stat.label} className="text-center">
      <div className="flex justify-center items-center text-h1 font-h1 text-customyellow mb-2">
        {stat.value}
      </div>

      <p className="text-customyellow font-p text-p">
        {stat.label}
      </p>
    </div>
  ))}
</div>
          </div>

          <div className="relative hidden sm:block">
            <img src={aboutImage} alt="Наша команда" className="w-full h-auto object-cover"
            style={{            
              maskImage: `url(${Mask2})`,
  maskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  maskPosition: 'center',

  WebkitMaskImage: `url(${Mask2})`,
  WebkitMaskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',}} />
          </div>
        </div>
      </div>
    </section>
  )
}
