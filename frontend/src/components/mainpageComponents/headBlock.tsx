import { Link } from 'react-router-dom'
import Logo from '../../assets/svg/Logo1.svg?react'
import ButtonSvg from '../../assets/svg/button.svg?react'
import heroImage from '../../assets/img/Mask_group.png'
import Mask1 from '../../assets/img/Mask1.png' 

export default function HeadBlock() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"

    >
      <div
        className="absolute inset-0 bg-customblack"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
            maskImage: `url(${Mask1})`,
  maskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  maskPosition: 'center',

  WebkitMaskImage: `url(${Mask1})`,
  WebkitMaskSize: '100% 100%',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
        }}
      />
      <div className="relative z-10 container mx-auto px-4 text-center pt-16 flex flex-col items-center justify-center">
        <Logo className="text-primary-1 w-400" />
        <p className="text-p mb-8 text-customwhite font-p max-w-2xl mx-auto">
          Место комфорта и развития
          <br />
          Секции и мероприятия для всех
        </p>
        <Link to="/schedule" className="relative inline-block">
          <ButtonSvg width={233} height={81} className="fill-customyellow z-10" />
          <span className="absolute inset-0 flex items-center justify-center z-20 text-customblack font-p text-p">
            записаться
          </span>
        </Link>
      </div>
    </section>
  )
}
