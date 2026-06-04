import { useState, useEffect, lazy, Suspense } from "react";

import TeamSlider from "../components/mainpageComponents/TeamSlider";
import { getPublicUrl } from '../utils/publicUrl';

import swordImage from "../assets/svg/sword.svg";
import arrowImage from "../assets/svg/arrow.svg";
import dragonImage from "../assets/svg/dragon.svg";
import masksImage from "../assets/svg/masks.svg";
import womenImage from "../assets/svg/women.svg";

const AnimatedSectionContent = lazy(
  () => import("../components/AnimatedSectionContent")
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
  {
    id: "fencing",
    name: "Фехтование",
    description: "Откройте для себя искусство владения клинком.",
    iconUrl: swordImage,
    imageUrl: swordImage,
    teachers: [],
  },
  {
    id: "archery",
    name: "Лучная стрельба",
    description: "Постигните концентрацию и меткость.",
    iconUrl: arrowImage,
    imageUrl: arrowImage,
    teachers: [],
  },
  {
    id: "dragon",
    name: "Фэнтези клуб",
    description: "Погрузитесь в мир приключений.",
    iconUrl: dragonImage,
    imageUrl: dragonImage,
    teachers: [],
  },
  {
    id: "theatre",
    name: "Театр",
    description: "Откройте актёрский талант.",
    iconUrl: masksImage,
    imageUrl: masksImage,
    teachers: [],
  },
  {
    id: "dance",
    name: "Пластика и танец",
    description: "Развивайте тело и душу.",
    iconUrl: womenImage,
    imageUrl: womenImage,
    teachers: [],
  },
];

/* ============================================================ */

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

  // Загрузка галереи при смене секции
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
            return {
              ...s,
              iconUrl,
              imageUrl,
              teachers: s.teachers ?? [],
            };
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

  // Делим массив URL пополам, максимум 4 изображения на сторону
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

  // Преподаватели со всех секций
  const teamMembers = sections
    .flatMap((s) => s.teachers ?? [])
    .map((t) => ({
      id: t.id,
      name: `${t.lastName} ${t.firstName}`,
      position: t.role ?? "Преподаватель",
      Image: t.photoUrl ?? "",
      audiosrc: t.audioUrl ?? "",
    }));

  // Заглушка для пустой галереи
  const renderPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
      <svg
        className="w-16 h-16 mb-4"
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
      <p className="text-lg text-center">Фото будет позже</p>
    </div>
  );

  // Рендерит masonry-сетку (2 колонки) или заглушку, если массив пуст
  const renderGalleryOrPlaceholder = (images: string[]) => {
    if (images.length === 0) {
      return renderPlaceholder();
    }
    return (
      <div
        className="columns-2 gap-4 p-4 w-full"
        style={{ columnGap: "1rem" }}
      >
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            className="w-full h-auto rounded-lg mb-4"
            alt=""
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-customblack text-customyellow flex flex-col items-center py-24 overflow-hidden">
      <h1 className="text-6xl font-h1 text-customyellow mb-20 tracking-wide uppercase">
        Секции
      </h1>

      <div className="relative flex items-start justify-center w-full max-w-7xl px-8">
        {/* Левая панель */}
        <div className="relative w-[360px] min-h-[430px] h-auto mr-16">
          <div className="absolute inset-0 textured-border rounded-xl" />
          {renderGalleryOrPlaceholder(galleryLeft)}
        </div>

        {/* Центральный блок */}
        <div className="flex flex-col items-center text-center max-w-lg">
          <div className="flex items-center justify-center gap-10 mb-10">
            <button
              onClick={prevSection}
              className="w-6 h-6 border-t-2 border-l-2 border-customyellow rotate-[-45deg] hover:opacity-80 transition"
            />

            <div
              className="w-[175px] h-[522px]"
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
              direction={direction}
            />
          </Suspense>
        </div>

        {/* Правая панель */}
        <div className="relative w-[360px] min-h-[430px] h-auto ml-16">
          <div className="absolute inset-0 border border-customyellow rounded-xl border-dashed" />
          {renderGalleryOrPlaceholder(galleryRight)}
        </div>
      </div>

      <h2 className="text-6xl font-h1 mt-32 mb-10 tracking-wide uppercase">
        Преподаватели
      </h2>

      <TeamSlider teamMembers={teamMembers} interval={5000} />
    </div>
  );
}