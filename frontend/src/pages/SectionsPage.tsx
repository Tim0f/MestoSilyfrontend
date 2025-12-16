import { useState, useEffect, lazy, Suspense } from "react";

import TeamSlider from "../components/mainpageComponents/TeamSlider";

  

import swordImage from "../assets/svg/sword.svg";

import arrowImage from "../assets/svg/arrow.svg";

import dragonImage from "../assets/svg/dragon.svg";

import masksImage from "../assets/svg/masks.svg";

import womenImage from "../assets/svg/women.svg";

  

const AnimatedSectionContent = lazy(

  () => import('../components/AnimatedSectionContent')

);

  

// сервисы

import { Client } from "../services/httpClient";

import { SectionsFrontendService } from "../services/sections.service";

  

const client = Client;

  

const sectionsService = new SectionsFrontendService(client);

  

interface Teacher {

  id: string;

  firstName: string;

  lastName: string;

  middleName?: string;

  phone?: string;

  role?: string;

  photoUrl?: string;

  audioUrl?: string;

}

  

interface Section {

  id: string;

  name: string;

  description: string;

  iconUrl: string;

  imageUrl?: string;

  teachers: Teacher[];

}

  

const fallbackSections: Section[] = [

  { id: "fencing", name: "Фехтование", description: "Откройте для себя искусство владения клинком.", iconUrl: swordImage, imageUrl: swordImage, teachers: [] },

  { id: "archery", name: "Лучная стрельба", description: "Постигните концентрацию и меткость.", iconUrl: arrowImage, imageUrl: arrowImage, teachers: [] },

  { id: "dragon", name: "Фэнтези клуб", description: "Погрузитесь в мир приключений.", iconUrl: dragonImage, imageUrl: dragonImage, teachers: [] },

  { id: "theatre", name: "Театр", description: "Откройте актёрский талант.", iconUrl: masksImage, imageUrl: masksImage, teachers: [] },

  { id: "dance", name: "Пластика и танец", description: "Развивайте тело и душу.", iconUrl: womenImage, imageUrl: womenImage, teachers: [] },

];

  

export default function SectionsPage() {

  const [sections, setSections] = useState<Section[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  const [direction, setDirection] = useState<1 | -1>(1);

  

  useEffect(() => {

    loadSections();

  }, []);

  

  const loadSections = async () => {

    try {

      const res = await sectionsService.findAll<Section[]>();

  

      if (Array.isArray(res) && res.length > 0) {

        setSections(

          res.map((s) => ({

            ...s,

            iconUrl: s.iconUrl ?? swordImage,

            imageUrl: s.imageUrl ?? s.iconUrl ?? swordImage,

            teachers: s.teachers ?? [],

          }))

        );

      } else {

        setSections(fallbackSections);

      }

    } catch (e) {

      console.error("Ошибка загрузки секций:", e);

      setSections(fallbackSections);

    } finally {

      setLoading(false);

    }

  };

  

  const prevSection = () => {

    setDirection(-1);

    setCurrentIndex((i) => (i === 0 ? sections.length - 1 : i - 1));

  };

  

  const nextSection = () => {

    setDirection(1);

    setCurrentIndex((i) => (i + 1) % sections.length);

  };

  

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-customyellow text-xl">

        Загрузка...

      </div>

    );

  }

  

  const current = sections[currentIndex];

  

  // ★ Собираем преподавателей со всех секций

  const teamMembers = sections

    .flatMap((s) => s.teachers ?? [])

    .map((t) => ({

      id: t.id,

      name: `${t.lastName} ${t.firstName}`,

      position: t.role ?? "Преподаватель",

      Image: t.photoUrl ?? "",

      audiosrc: t.audioUrl ?? "",

    }));

  

  return (

    <div className="relative w-full min-h-screen bg-customblack text-customyellow flex flex-col items-center py-24 overflow-hidden">

  

      <h1 className="text-6xl font-h1 text-customyellow mb-20 tracking-wide uppercase">

        Секции

      </h1>

  

      <div className="relative flex items-center justify-center w-full max-w-7xl px-8">

  

        {/* Левая сетка */}

        <div className="relative w-[360px] h-[430px] mr-16 ">

          <div className="absolute inset-0 textured-border rounded-xl " />

          <div className="grid grid-cols-2 gap-4 w-full h-full p-4">

            {[1, 2, 3, 4].map((i) => (

              <img

                key={i}

                src={current.imageUrl}

                className="w-full h-full object-cover rounded-lg"

              />

            ))}

          </div>

        </div>

  

        {/* Центральный блок */}

        <div className="flex flex-col items-center text-center max-w-lg">

          <div className="flex items-center justify-center gap-10 mb-10">

  

            <button

              onClick={prevSection}

              className="w-6 h-6 border-t-2 border-l-2 border-customyellow rotate-[-45deg] hover:opacity-80 transition"

            />

  

            <div

              className="w-[175px] h-[522px] "

              style={{

                WebkitMaskImage: `url(${current.iconUrl})`,

                maskImage: `url(${current.iconUrl})`,

                WebkitMaskSize: "contain",

                maskSize: "contain",

                WebkitMaskRepeat: "no-repeat",

                maskRepeat: "no-repeat",

                WebkitMaskPosition: "center",

                maskPosition: "center",

                backgroundColor: "#F4C884",

              }}

            />

  

            <button

              onClick={nextSection}

              className="w-6 h-6 border-t-2 border-r-2 border-customyellow rotate-[45deg] hover:opacity-80 transition"

            />

          </div>

  

<Suspense fallback={null}>

  <AnimatedSectionContent

    id={current.id}

    name={current.name}

    description={current.description}

    direction={direction}

  />

</Suspense>

  

        </div>

  

        {/* Правая сетка */}

        <div className="relative w-[360px] h-[430px] ml-16">

          <div className="absolute inset-0 border border-customyellow rounded-xl border-dashed" />

          <div className="grid grid-cols-2 gap-4 w-full h-full p-4">

            {[1, 2, 3, 4].map((i) => (

              <img

                key={i}

                src={current.imageUrl}

                className="w-full h-full object-cover rounded-lg"

              />

            ))}

          </div>

        </div>

      </div>

  

      <h2 className="text-6xl font-h1 mt-32 mb-10 tracking-wide uppercase">

        Преподаватели

      </h2>

  

      {/* ★ Передаём преподавателей в слайдер */}

      <TeamSlider teamMembers={teamMembers} interval={5000} />

    </div>

  );

}