import InnerFrame from "../assets/svg/Rectangle 77.svg";

interface ModalFreeSessionsProps {
  onClose: () => void;
}

export default function ModalFreeSessions({ onClose }: ModalFreeSessionsProps) {
  return (
    <div>
      <h2 className="text-[34px] text-white mb-[40px] font-h1">
        бесплатные занятия
      </h2>

      <div className="flex gap-[40px] justify-center">

        {["1 занятие", "1 занятие", "5 занятий", "10 занятий"].map((title, i) => (
          <div key={i} className="relative w-[400px] p-[50px]">
            <img src={InnerFrame} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10">
              <h3 className="text-[42px] font-h1">{title}</h3>
              <p className="mt-[8px] text-[20px]">
                Откройте искусство владения клинком
              </p>
              <div className="text-[64px] mt-[20px] font-bold">
                {i === 0 ? "12🌀" : i === 1 ? "1100₽" : i === 2 ? "4950₽" : "9900₽"}
              </div>
              <button className="bg-[#F5C78B] text-black px-[40px] py-[16px] mt-[20px] text-[22px]">
                Оплатить
              </button>
            </div>
          </div>
        ))}

      </div>

      <button
        onClick={onClose}
        className="absolute top-[20px] right-[40px] text-[48px] text-[#F5C78B]"
      >
        ✕
      </button>
    </div>
  );
}
