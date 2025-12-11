import InnerFrame from "../assets/svg/Rectangle 77.svg";

export default function ModalEnroll({ onClose }: { onClose: () => void }) {
  return (
    <div>

      <h2 className="text-[34px] text-white mb-[40px] font-h1">
        для занятий за 1100 руб
      </h2>

      <div className="flex gap-[40px] justify-center">

        {/* Карточка №1 */}
        <div className="relative w-[480px] h-[600px]">

          {/* фон */}
          <div className="absolute inset-0 bg-customyellow rounded-[14px]" />

          {/* обводка */}
          <img
            src={InnerFrame}
            className="absolute inset-0 w-full h-full"
          />

          {/* контент */}
          <div className="relative z-10 px-[50px] py-[40px] text-black">
            <h3 className="text-[48px] font-h1">1 занятие</h3>
            <p className="mt-[10px] text-[20px] max-w-[300px]">
              Откройте для себя искусство владения клинком.
            </p>
            <div className="text-[82px] font-['Zero_Cool'] mt-[30px]">12🌀</div>
            <button className="mt-[40px] bg-black text-white px-[50px] py-[16px] text-[22px] font-h1">
              Оплатить
            </button>
          </div>
        </div>

        {/* Карточка №2 */}
        <div className="relative w-[480px] h-[600px]">

          <div className="absolute inset-0 bg-customblack rounded-[14px]" />

          <img
            src={InnerFrame}
            className="absolute inset-0 w-full h-full"
          />

          <div className="relative z-10 px-[50px] py-[40px] text-white">
            <h3 className="text-[48px] font-h1 text-white">1 занятие</h3>
            <p className="mt-[10px] text-[20px] max-w-[300px] text-white">
              Откройте для себя искусство владения клинком.
            </p>
            <div className="text-[82px] font-['Zero_Cool'] mt-[30px] text-customyellow">
              1100₽
            </div>
            <button className="mt-[40px] bg-customyellow text-black px-[50px] py-[16px] text-[22px] font-h1">
              Оплатить
            </button>
          </div>
        </div>

      </div>

      <button
        onClick={onClose}
        className="absolute top-[20px] right-[40px] text-[48px] text-customyellow"
      >
        ✕
      </button>

    </div>
  );
}
