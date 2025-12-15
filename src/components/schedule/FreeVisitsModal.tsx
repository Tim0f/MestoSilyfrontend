import bg from "../../assets/svg/bg_mogal.svg";

import Zerno from "../../assets/svg/Zerno.svg";
import btnFrame from "../../assets/svg/button.svg";

interface Props {
  onClose: () => void;
}

export default function FreeVisitsModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="relative w-[95vw] max-w-[1600px] max-h-[85vh] text-white overflow-hidden">

        {/* рамка */}
        <img
          src={bg}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* закрыть */}
        <button
          onClick={onClose}
          className="absolute top-[24px] right-[32px] text-customyellow text-[42px] hover:scale-110 transition z-20"
        >
          ×
        </button>

        {/* контент */}
        <div className="relative z-10 h-full px-[48px] py-[48px] overflow-y-auto">
          <div className="flex flex-wrap justify-center gap-[32px]">

            {/* ПРОБНОЕ */}
            <div className="w-[300px] min-h-[450px] bg-customyellow text-black p-[32px] flex flex-col justify-between">
              <div>
                <h3 className="text-[36px] font-h1">1 занятие</h3>
                <p className="text-[16px] mt-[16px] leading-[20px]">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="flex items-center gap-[12px]">
                <span className="text-[64px] font-h1 leading-none">12</span>
                <img src={Zerno} alt="" className="w-[40px] h-[40px]" />
              </div>

              <button
                className="bg-black text-customyellow text-[18px] font-bold hover:opacity-80 transition"
                style={{
                  WebkitMaskImage: `url(${btnFrame})`,
                  maskImage: `url(${btnFrame})`,
                  WebkitMaskSize: "100% 100%",
                  padding: "18px 48px",
                }}
              >
                Оплатить
              </button>
            </div>

            {/* 1 ЗАНЯТИЕ */}
            <div className="w-[300px] min-h-[450px] border-2 border-customyellow p-[32px] flex flex-col justify-between">
              <div>
                <h3 className="text-[36px] font-h1">1 занятие</h3>
                <p className="text-[16px] mt-[16px] leading-[20px] text-customyellow">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="text-[56px] font-h1 text-customyellow">1100₽</div>

              <button
                className="bg-customyellow text-black text-[18px] font-bold hover:opacity-80 transition"
                style={{
                  WebkitMaskImage: `url(${btnFrame})`,
                  maskImage: `url(${btnFrame})`,
                  WebkitMaskSize: "100% 100%",
                  padding: "18px 48px",
                }}
              >
                Оплатить
              </button>
            </div>

            {/* 5 ЗАНЯТИЙ */}
            <div className="w-[300px] min-h-[450px] border-2 border-customyellow p-[32px] flex flex-col justify-between">
              <div>
                <h3 className="text-[36px] font-h1">5 занятий</h3>
                <p className="text-[16px] mt-[16px] leading-[20px] text-customyellow">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="text-[56px] font-h1 text-customyellow">4950₽</div>

              <button
                className="bg-customyellow text-black text-[18px] font-bold hover:opacity-80 transition"
                style={{
                  WebkitMaskImage: `url(${btnFrame})`,
                  maskImage: `url(${btnFrame})`,
                  WebkitMaskSize: "100% 100%",
                  padding: "18px 48px",
                }}
              >
                Оплатить
              </button>
            </div>

            {/* 10 ЗАНЯТИЙ */}
            <div className="w-[300px] min-h-[450px] border-2 border-customyellow p-[32px] flex flex-col justify-between">
              <div>
                <h3 className="text-[36px] font-h1">10 занятий</h3>
                <p className="text-[16px] mt-[16px] leading-[20px] text-customyellow">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="text-[56px] font-h1 text-customyellow">9900₽</div>

              <button
                className="bg-customyellow text-black text-[18px] font-bold hover:opacity-80 transition"
                style={{
                  WebkitMaskImage: `url(${btnFrame})`,
                  maskImage: `url(${btnFrame})`,
                  WebkitMaskSize: "100% 100%",
                  padding: "18px 48px",
                }}
              >
                Оплатить
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
