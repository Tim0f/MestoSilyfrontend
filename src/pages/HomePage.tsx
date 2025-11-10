import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'
import axios from 'axios'
import heroImage from '../assets/img/Mask_group.png'
import aboutImage from '../assets/img/Mask_group2.png'
import swordIcon from '../assets/svg/sword.svg'
import arrowIcon from '../assets/svg/arrow.svg'
import dragonIcon from '../assets/svg/dragon.svg'
import masksIcon from '../assets/svg/masks.svg'
import womenIcon from '../assets/svg/women.svg'
import Logo from '../assets/svg/Logo1.svg?react'
import LogoSvg from '../assets/svg/Rectangle_9.svg?react'
import Stick from '../assets/img/sticker.webp'
import Stick2 from '../assets/img/sticker1.webp'
import TeamSlider from '../components/TeamSlider'

interface NewsItem {
  id: number
  title: string
  content: string
  imageUrl?: string
  createdAt: string
}

interface Section {
  id: number
  name: string
  description: string
  ageGroup: string
}

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [activeTileId, setActiveTileId] = useState<string>('fencing')
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0)
  const [newsRevealed, setNewsRevealed] = useState(false)
  const [currentNewsPage, setCurrentNewsPage] = useState(0)

 
  const partners = [
    {
      id: 1,
      name: 'Школа Летово',
      Image: Stick,
      url: 'Saga'
    },
    {
      id: 2,
      name: 'Школа Осеннево',
      Image: Stick,
      url: 'Saga'
    },
    {
      id: 3,
      name: 'Школа Зимнево',
      Image: Stick,
      url: 'Saga'
    },
    {
      id: 4,
      name: 'Школа Весеннего',
      Image: Stick,
      url: 'Saga'
    },
    {
      id: 5,
      name: 'Школа межсезонного',
      Image: Stick,
      url: 'Saga'
    },
    {
      id: 6,
      name: 'Школа Внесезонного',
      Image: Stick,
      url: 'Saga'
    }
  ]
  const showcaseSections = [
    {
      id: 'fencing',
      title: 'Актерское фехтование',
      description:
        'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
      teacher: 'Иван Иванович Иванов',
      price: '1000₽/час',
      image: swordIcon,
    },
    { id: 'archery', title: 'Лучная стрельба', description:
      'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: arrowIcon },
    { id: 'dragon', title: 'Фэнтези клуб', description:
      'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: dragonIcon },
    { id: 'theatre', title: 'Театр', description:
      'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: masksIcon },
    { id: 'dance', title: 'Пластика и танец', description:
      'Откройте для себя искусство владения клинком. От базовых стоек до изящных атак.',
    teacher: 'Иван Иванович Иванов',
    price: '1000₽/час',
    image: womenIcon },
  ]

  useEffect(() => {
    fetchNews()
    fetchSections()
  }, [])

  // Плавное появление карточек новостей со ступенчатой задержкой
  useEffect(() => {
    const id = window.setTimeout(() => setNewsRevealed(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  // Автоматическое переключение команды каждые 10 секунд
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTeamIndex((prev: number) => (prev + 1) % teamMembers.length)
  //   }, 10000)

  //   return () => clearInterval(interval)
  // }, [teamMembers.length])

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news')
      setNews(response.data.slice(0, 3))
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error)
    }
  }

  // Группы новостей для пагинации (по 3 новости на страницу)
  const newsGroups = [
    [
      { title: 'Harda', content: 'В этот вторник в 18:30 состоится Hard Tournament\nБолельщикам вход бесплатный! Разрешено шуметь,\nболеть за своих друзей. Наконец-то в Месте силы\nначинаются ивенты.\nГлавный приз - бесплатная тренировка и маленький\nсюрприз)', bgColor: 'bg-black/60' },
      { title: 'Harda', content: 'В этот вторник в 18:30 состоится Hard Tournament\nБолельщикам вход бесплатный! Разрешено шуметь,\nболеть за своих друзей. Наконец-то в Месте силы\nначинаются ивенты.\nГлавный приз - бесплатная тренировка и маленький\nсюрприз)', bgColor: 'bg-[#2D282A]' },
      { title: 'Harda', content: 'В этот вторник в 18:30 состоится Hard Tournament\nБолельщикам вход бесплатный! Разрешено шуметь,\nболеть за своих друзей. Наконец-то в Месте силы\nначинаются ивенты.\nГлавный приз - бесплатная тренировка и маленький\nсюрприз)', bgColor: 'bg-[#2D282A]' },
    ],
    [
      { title: 'Новое расписание', content: 'С радостью сообщаем о новом расписании занятий.\nТеперь доступны вечерние группы для всех направлений.\nЗапись открыта!', bgColor: 'bg-black/60' },
      { title: 'Мастер-класс', content: 'Приглашаем на мастер-класс по сценическому движению.\nПроводит известный хореограф.\nРегистрация обязательна.', bgColor: 'bg-[#2D282A]' },
      { title: 'Турнир', content: 'Подготовка к региональному турниру.\nТренировки проходят в усиленном режиме.\nПрисоединяйтесь!', bgColor: 'bg-[#2D282A]' },
    ],
    [
      { title: 'Новинки в магазине', content: 'В нашем магазине появились новые товары:\nреквизит для тренировок, костюмы и аксессуары.\nСпешите приобрести!', bgColor: 'bg-black/60' },
      { title: 'Экскурсия', content: 'Организуем экскурсию в музей фехтования.\nДля всех участников бесплатно.\nДата уточняется.', bgColor: 'bg-[#2D282A]' },
      { title: 'Открытие сезона', content: 'Торжественное открытие нового сезона.\nЖдем всех на праздничном мероприятии\nс концертом и мастер-классами.', bgColor: 'bg-[#2D282A]' },
    ],
  ]

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/sections')
      setSections(response.data.slice(0, 4))
    } catch (error) {
      console.error('Ошибка загрузки секций:', error)
    }
  }

  return (
    <div className="bg-customblack min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-customblack" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>
        <div className="relative z-10 container mx-auto px-4 text-center pt-16 flex flex-col items-center justify-center">
        
          <Logo className='text-primary-1 w-400'  ></Logo>
          <p className="text-p mb-8 text-customwhite font-p max-w-2xl mx-auto">
            Место комфорта и развития<br />
            Секции и мероприятия для всех
          </p>
          <Link to="/sections" className="relative inline-block">
  <LogoSvg width={233} height={81} className="text-customyellow z-10 "  />
  <span className="absolute inset-0 flex items-center justify-center z-20 text-customblack font-p text-p">
    записаться
  </span>
</Link>
        </div>
      </section>

      {/* О нас */}
      <section className="py-20 flex justify-center items-center bg-[#2D282A]">
        <div className="pl-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Левая часть - текст и статистика */}
            <div>
              <h2 className="mb-8 text-h1 font-h1 text-customyellow ">
                О НАС
              </h2>
              
              <p className="text-customwhite font-p text-p mb-12 leading-relaxed">
                «Место Силы» — это сообщество единомышленников, где каждый найдет занятие по душе. 
                Мы создаем пространство для творчества, спорта и общения.
              </p>

              {/* Статистика */}
              <div className="flex justify-between gap-8">
                <div>
                  <div className="flex justify-center items-center text-h1 font-h1 text-customyellow mb-2 font-h1">
                    5
                  </div>
                  <p className="text-customyellow font-p text-p">событий в месяц</p>
                </div>

                <div>
                  <div className="flex justify-center items-center text-h1 font-h1 text-customyellow mb-2 font-h1">
                    12
                  </div>
                  <p className="text-customyellow font-p text-p">направлений</p>
                </div>

                <div>
                  <div className="flex justify-center items-center text-h1 font-h1 text-customyellow mb-2 font-h1">
                    1
                  </div>
                  <p className="text-customyellow font-p text-p">уютная площадка</p>
                </div>

                <div>
                  <div className="flex justify-center items-center text-h1 font-h1 text-customyellow mb-2 font-h1">
                    26
                  </div>
                  <p className="text-customyellow font-p text-p">наставников</p>
                </div>
              </div>
            </div>

            {/* Правая часть - изображение */}
            <div className="relative bg-hero-pattern stroke-customyellow" >
              <img
                src={aboutImage}
                alt="Наша команда" 
                className="w-full h-auto object-cover "
              />
            </div>
          </div>
        </div>
      </section>

      {/* Секции (плашки с выдвижением) */}
      <section className="py-20 bg-customblack">
        <div className="px-10 ">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-h1 font-h1 text-customyellow">Секции</h2>
            <Link
              to="/sections"
              className="text-primary-400 hover:text-primary-300 font-p flex items-center gap-2"
            >
              подробнее <ArrowRight size={20} />
            </Link>
          </div>

          {/* Лента плашек */}
          <div
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide"
            onMouseLeave={() => setActiveTileId('fencing')}
          >
            {showcaseSections.map((tile, index) => {
              const isActive = activeTileId === tile.id
              return (
              <div
                key={tile.id}
                onMouseEnter={() => setActiveTileId(tile.id)}
                onFocus={() => setActiveTileId(tile.id)}
                className={`relative flex-shrink-0 h-[570px] transition-all duration-500 ease-out 
                bg-[radial-gradient(ellipse_at_center,rgba(200,152,96,0.08),rgba(0,0,0,0))] 
                border border-primary-900/40 rounded-2xl overflow-hidden group 
                ${isActive || index === 0 && activeTileId === 'fencing' && tile.id === 'fencing' ? 'w-[570px]' : 'w-[287px]'}`}
              >
                {/* Контент плитки (открытая форма с иконкой слева) */}
                <div className="h-full w-full flex">
                  {/* Левая колонка с SVG фиксированного размера */}
                  <div className="w-[220px] flex-none flex items-center justify-center px-6">
                    <img
                      src={tile.image}
                      alt={tile.title}
                      className="w-[175px] h-[522px] object-contain opacity-90 select-none pointer-events-none"
                      style={{
                        filter: 'brightness(0) saturate(100%) invert(83%) sepia(21%) saturate(588%) hue-rotate(338deg) brightness(99%) contrast(93%)'
                      }}
                    />
                  </div>
                  {/* Правая колонка с текстом */}
                  <div className="flex-1 p-6 flex flex-col">
                    {/* Весь контент видим только у активной плашки (или первой по умолчанию) */}
                    {(isActive || (index === 0 && activeTileId === 'fencing' && tile.id === 'fencing')) && (
                      <div className="flex flex-col h-full">
                        <h3 className="text-h2 font-h2 text-customyellow drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
                          {tile.title}
                        </h3>
                       
                            <p className="text-customwhite font-p max-w-md mb-6 mt-4">
                              {tile.description}
                            </p>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-full bg-customyellow/60 border border-customyellow/30" />
                              <div>
                                <div className="text-customyellow font-p">Учитель:</div>
                                <div className="text-customwhite font-p">{tile.teacher}</div>
                              </div>
                            </div>
                        
                        {/* Нижняя зона: цена (если есть) и кнопка у дна карточки */}
                        <div className="mt-auto">
                          {tile.price && (
                            <div className="text-h2 font-h2 text-customwhite mb-4">{tile.price}</div>
                          )}
                          <Link
                            to="/sections"
                            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-p transition"
                          >
                            записаться
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Новости */}
      <section className="py-20 bg-[#2D282A]">
        <div className="px-10">
          <div className="text-center mb-12 ">
            <h2 className="text-5xl md:text-6xl font-h1 text-primary-300 mb-8" style={{
              letterSpacing: '0.05em'
            }}>
              НОВОСТИ
            </h2>
          </div>
          
          {/* Контейнер для новостей с плавной сменой страниц */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsGroups[currentNewsPage].map((newsItem, index) => (
                <div
                  key={`${currentNewsPage}-${index}`}
                  className={`${newsItem.bgColor} border border-primary-500/50 rounded-2xl overflow-hidden group transition-all duration-700 ease-out transform hover:-translate-y-1 hover:border-primary-400/70 ${newsRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="p-8">
                    <h3 className="text-3xl font-h2 text-white mb-6">{newsItem.title}</h3>
                    <p className="text-white font-p leading-relaxed mb-6 whitespace-pre-line">
                      {newsItem.content}
                    </p>
                    <img
                      src={aboutImage}
                      alt={newsItem.title}
                      className="w-full h-64 object-cover rounded-lg transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Пагинация с рабочими кнопками */}
          <div className="flex justify-center mt-12 gap-3">
            {newsGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setNewsRevealed(false)
                  setTimeout(() => {
                    setCurrentNewsPage(index)
                    setTimeout(() => setNewsRevealed(true), 50)
                  }, 350)
                }}
                className={`transition-all duration-300 ${
                  index === currentNewsPage
                    ? 'w-3 h-3 bg-primary-500 rounded-full scale-110'
                    : 'w-3 h-3 border border-primary-500/50 rounded-full hover:border-primary-500/80 hover:scale-110'
                }`}
                aria-label={`Перейти на страницу ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

       {/* Команда */}
       <section className="py-20 bg-[#2D282A]">
         <div className="container mx-auto px-4">
           <h2 className="text-5xl md:text-6xl text-center mb-16 text-primary-300 font-h1" style={{
             letterSpacing: '0.05em'
           }}>
             КОМАНДА
           </h2>
          <TeamSlider></TeamSlider>


         </div>
       </section>

      {/* Партнеры */}
      <section className="py-20 bg-[#2D282A]">
        <div className="container mx-auto px-4 ">
          <h2 className="text-5xl md:text-6xl font-h1 text-center mb-16 text-primary-300 " style={{
            letterSpacing: '0.05em'
          }}>
            ПАРТНЕРЫ
          </h2>
          
          <div className="flex justify-center items-center gap-8 mb-12">
  {partners.map((partner, index) => {
    
    return (
      <div 
        key={partner.id}
        className={`relative transition-all duration-500 cursor-pointer`}
        onClick={() => setCurrentPartnerIndex(index)}
      >
        <div className="w-64 h-64 bg-dark-800 border border-primary-500/50 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src={partner.Image} 
              alt={partner.name}
              className="w-48 h-48 rounded-full object-cover border border-primary-400/50"
            />
          </div>
        </div>
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <h3 className="text-lg font-bold text-gray-400">{partner.name}</h3>
          
        
        </div>
      </div>
    );
  })}
</div>
        </div>
      </section>
    </div>
  )
}

