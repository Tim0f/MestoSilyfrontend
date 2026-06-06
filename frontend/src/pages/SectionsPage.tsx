import { useState, useEffect, lazy, Suspense } from "react";
import TeamSlider from "../components/mainpageComponents/TeamSlider";
import { getPublicUrl } from '../utils/publicUrl';
import TexturedBorder from "../components/TexturedBorder"; // <-- добавлен импорт

import swordImage from "../assets/svg/sword.svg";
import arrowImage from "../assets/svg/arrow.svg";
import dragonImage from "../assets/svg/dragon.svg";
import masksImage from "../assets/svg/masks.svg";
import womenImage from "../assets/svg/women.svg";

const AnimatedSectionContent = lazy(
  () => import("../components/AnimatedSectionContent")
);

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
  price: number;
  teachers: Teacher[];
}

const fallbackSections: Section[] = [
  {
    id: "fencing",
    name: "Фехтование",
    description: "Откройте для себя искусство владения клинком.",
    iconUrl: swordImage,
    imageUrl: swordImage,
    price: 1100,
    teachers: [],
  },
  {
    id: "archery",
    name: "Лучная стрельба",
    description: "Постигните концентрацию и меткость.",
    iconUrl: arrowImage,
    imageUrl: arrowImage,
    price: 1100,
    teachers: [],
  },
  {
    id: "dragon",
    name: "Фэнтези клуб",
    description: "Погрузитесь в мир приключений.",
    iconUrl: dragonImage,
    imageUrl: dragonImage,
    price: 1100,
    teachers: [],
  },
  {
    id: "theatre",
    name: "Театр",
    description: "Откройте актёрский талант.",
    iconUrl: masksImage,
    imageUrl: masksImage,
    price: 1100,
    teachers: [],
  },
  {
    id: "dance",
    name: "Пластика и танец",
    description: "Развивайте тело и душу.",
    iconUrl: womenImage,
    imageUrl: womenImage,
    price: 1100,
    teachers: [],
  },
];

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [galleryLeft, setGalleryLeft] = useState<string[]>([]);
  const [galleryRight, setGalleryRight] = useState<string[]>([]);

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      const current = sections[currentIndex];
      if (current) {
        loadGallery(current.id, current.imageUrl || swordImage);
      }
    }
  }, [currentIndex, sections]);

  const loadSections = async () => {
    try {
      const res = await sectionsService.findAll<Section[]>();
      if (Array.isArray(res) && res.length > 0) {
        setSections(
          res.map((s) => {
            const iconUrl = getPublicUrl(s.iconUrl) || swordImage;
            const imageUrl = getPublicUrl(s.imageUrl) || swordImage;
            return { ...s, iconUrl, imageUrl, teachers: s.teachers ?? [] };
          })
        );
      } else {
        setSections(fallbackSections);
      }
    } catch (e) {
      setSections(fallbackSections);
    } finally {
      setLoading(false);
    }
  };

  const loadGallery = async (sectionId: string, fallbackImage: string) => {
    try {
      const images = await sectionsService.getImages<{ imageUrl: string }[]>(sectionId);
      if (Array.isArray(images) && images.length > 0) {
        const urls = images.map((img) => getPublicUrl(img.imageUrl) || fallbackImage);
        splitUrls(urls);
      } else {
        setGalleryLeft([]);
        setGalleryRight([]);
      }
    } catch {
      setGalleryLeft([]);
      setGalleryRight([]);
    }
  };

  const splitUrls = (urls: string[]) => {
    const half = Math.ceil(urls.length / 2);
    const left = urls.slice(0, half).slice(0, 4);
    const right = urls.slice(half).slice(0, 4);
    setGalleryLeft(left);
    setGalleryRight(right);
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

const teamMembers = (current.teachers ?? [])
    .map((t) => ({
      id: t.id,
      name: `${t.lastName} ${t.firstName}`,
      position: t.role ?? "Преподаватель",
      Image: t.photoUrl ?? "",
      audiosrc: t.audioUrl ?? "",
    }));

  // Заглушка
  const renderPlaceholder = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4">
      <svg
        className="w-12 h-12 mb-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z"
        />
      </svg>
      <p className="text-sm text-center">Фото будет позже</p>
    </div>
  );

  const renderAdaptiveMasonry = (images: string[]) => {
    // Если изображений нет совсем — показываем заглушку
    if (!images || images.length === 0) {
      return renderPlaceholder();
    }

    const count = images.length;

    // Динамический grid в зависимости от количества фото
    let gridStyle: React.CSSProperties = {};
    let elements: JSX.Element[] = [];

    if (count === 1) {
      // Одно фото на весь блок
      gridStyle = {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
      };
      elements = [
        <div key={0} className="overflow-hidden rounded-lg">
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
        </div>
      ];
    } else if (count === 2) {
      // Две строки 1:1
      gridStyle = {
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr 1fr',
      };
      elements = images.map((src, i) => (
        <div key={i} className="overflow-hidden rounded-lg">
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ));
    } else if (count === 3) {
      // Одна широкая сверху (60%), две снизу в ряд (40%)
      gridStyle = {
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '3fr 2fr',
      };
      elements = [
        <div key="0" className="col-span-2 overflow-hidden rounded-lg">
          <img src={images[0]} alt="" className="w-full h-full object-cover" />
        </div>,
        <div key="1" className="overflow-hidden rounded-lg">
          <img src={images[1]} alt="" className="w-full h-full object-cover" />
        </div>,
        <div key="2" className="overflow-hidden rounded-lg">
          <img src={images[2]} alt="" className="w-full h-full object-cover" />
        </div>,
      ];
    } else {
      // 4 и более — используем сложную сетку, обрезаем до 4
      const four = images.slice(0, 4);
      gridStyle = {
        gridTemplateColumns: '312fr 262fr',
        gridTemplateRows: '172fr 294fr 243fr',
      };
      elements = [
        <div key="0" className="col-start-1 row-start-1 overflow-hidden rounded-lg">
          <img src={four[0]} alt="" className="w-full h-full object-cover" />
        </div>,
        <div key="1" className="col-start-2 row-start-1 row-span-2 overflow-hidden rounded-lg">
          <img src={four[1]} alt="" className="w-full h-full object-cover" />
        </div>,
        <div key="2" className="col-start-1 row-start-2 overflow-hidden rounded-lg">
          <img src={four[2]} alt="" className="w-full h-full object-cover" />
        </div>,
        <div key="3" className="col-start-1 col-span-2 row-start-3 overflow-hidden rounded-lg">
          <img src={four[3]} alt="" className="w-full h-full object-cover" />
        </div>,
      ];
    }

    return (
      <div
        className="grid w-full h-full gap-[16px]"
        style={gridStyle}
      >
        {elements}
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-customblack text-customyellow flex flex-col items-center py-24 overflow-hidden">
      <h1 className="text-h1 font-h1 text-customyellow mb-20 tracking-wide uppercase">
        Секции
      </h1>

      <div className="flex items-center justify-center gap-16 w-full max-w-[1600px] mx-auto px-8">
        {/* Левая панель */}
        <div className="relative w-[420px] h-auto mr-16">
          <TexturedBorder /> {/* заменён div с textured-border */}
          <div className="relative z-10 p-4">
            <div className="aspect-[590/741] w-full">
              {renderAdaptiveMasonry(galleryLeft)}
            </div>
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
              className="w-[120px] h-[240px]"
              style={{
                WebkitMaskImage: `url(${current.iconUrl})`,
                maskImage: `url(${current.iconUrl})`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
                backgroundColor: 'rgb(var(--color-customyellow))',
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
              price={current.price}
              direction={direction}
            />
          </Suspense>
        </div>

        {/* Правая панель */}
        <div className="relative w-[420px] h-auto ml-16">
          <TexturedBorder /> {/* заменён div с border-dashed */}
          <div className="relative z-10 p-4">
            <div className="aspect-[590/741] w-full">
              {renderAdaptiveMasonry(galleryRight)}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-h1 font-h1 mt-32 mb-10 tracking-wide uppercase">
        Преподаватели
      </h2>
      <TeamSlider teamMembers={teamMembers} interval={5000} />
    </div>
  );
}