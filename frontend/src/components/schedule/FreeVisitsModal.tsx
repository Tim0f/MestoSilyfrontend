// FreeVisitsModal.tsx
import { useState } from "react";

import bg from "../../assets/svg/bg_mogal.svg";
import Zerno from "../../assets/svg/Zerno.svg";
import btnFrame from "../../assets/svg/button.svg";

import { freeVisitsService } from "../../services/FreeVisitsFrontendService";
import { grainsFrontendService } from "../../services/grains.service";

interface Props {
  onClose: () => void;
}

export default function FreeVisitsModal({ onClose }: Props) {
  /* ================= JWT ================= */

  const token = localStorage.getItem("token");

  const userId = (() => {
    if (!token) return null;

    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      return payload.sub as string;
    } catch (e) {
      console.error("Ошибка декодирования JWT", e);
      return null;
    }
  })();

  if (!userId) {
    alert("Пользователь не авторизован");
    onClose();
    return null;
  }

  /* ================= STATE ================= */

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ================= HANDLERS ================= */

  // покупка 1 занятия за зёрна
  const handleBuyWithGrains = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await grainsFrontendService.deduct({
        userId,
        amount: 12,
        reason: "Покупка бесплатного занятия",
      });

      await freeVisitsService.purchaseFreeVisits(1);

      alert("Занятие добавлено");
      onClose();
    } catch (e: any) {
      console.error(e);

      const backendMessage =
        e?.details?.message || // ← ВАЖНО
        e?.message ||
        "";

      if (backendMessage.includes("Недостаточно зерен")) {
        setErrorMessage("Недостаточно зёрен для оплаты");
      } else if (e?.status === 401) {
        setErrorMessage("Необходимо войти в систему");
      } else {
        setErrorMessage("Ошибка при покупке");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // покупка занятий за деньги
  const handleBuyPaid = async (amount: 1 | 5 | 10) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      // 🧪 ЗАГЛУШКА: покупка за деньги = начисление зёрен
      const grainsMap: Record<1 | 5 | 10, number> = {
        1: 12,
        5: 60,
        10: 120,
      };

      await grainsFrontendService.add({
        userId,
        amount: grainsMap[amount],
        reason: "Покупка за деньги (заглушка)",
      });

      alert(`Начислено зёрен: ${grainsMap[amount]}`);
      onClose();
    } catch (e: any) {
      console.error(e);

      if (e?.status === 401) {
        setErrorMessage("Необходимо войти в систему");
      } else {
        setErrorMessage("Ошибка при покупке");
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-customblack/70">
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
          className="absolute top-[12px] right-[16px] md:top-[24px] md:right-[32px] text-customyellow text-[32px] md:text-[42px] hover:scale-110 transition z-20"
          disabled={isLoading}
        >
          ×
        </button>

        {/* контент */}
        <div className="relative z-10 h-full px-[24px] py-[24px] md:px-[48px] md:py-[48px] overflow-y-auto">

          {/* ОБЩАЯ ОШИБКА */}
          {errorMessage && (
            <div className="mb-[32px] flex justify-center">
              <div className="px-[32px] py-[16px] bg-red-900/80 text-red-200 text-[16px] font-semibold rounded-md">
                {errorMessage}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-[32px]">

            {/* ПРОБНОЕ */}
            <div className="w-full sm:w-[300px] min-h-[450px] bg-customyellow text-black p-[24px] md:p-[32px] flex flex-col justify-between">
              <div>
                <h3 className="text-[28px] md:text-[36px] font-h1">1 занятие</h3>
                <p className="text-[14px] md:text-[16px] mt-[12px] md:mt-[16px] leading-[20px]">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="flex items-center gap-[12px]">
                <span className="text-[48px] md:text-[64px] font-h1 leading-none">12</span>
                <img src={Zerno} alt="" className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]" />
              </div>

              <div>
                <button
                  onClick={handleBuyWithGrains}
                  disabled={isLoading}
                  className="bg-black text-customyellow text-[16px] md:text-[18px] font-bold hover:opacity-80 transition disabled:opacity-50"
                  style={{
                    WebkitMaskImage: `url(${btnFrame})`,
                    maskImage: `url(${btnFrame})`,
                    WebkitMaskSize: "100% 100%",
                    padding: "18px 48px",
                  }}
                >
                  {isLoading ? "Подождите..." : "Оплатить"}
                </button>
              </div>
            </div>

            {/* 1 ЗАНЯТИЕ */}
            <div className="w-full sm:w-[300px] min-h-[450px] border-2 border-customyellow p-[24px] md:p-[32px] flex flex-col justify-between">
              <div>
                <h3 className="text-[28px] md:text-[36px] font-h1">1 занятие</h3>
                <p className="text-[14px] md:text-[16px] mt-[12px] md:mt-[16px] leading-[20px] text-customyellow">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="text-[44px] md:text-[56px] font-h1 text-customyellow">1100₽</div>

              <button
                onClick={() => handleBuyPaid(1)}
                disabled={isLoading}
                className="bg-customyellow text-black text-[16px] md:text-[18px] font-bold hover:opacity-80 transition disabled:opacity-50"
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
            <div className="w-full sm:w-[300px] min-h-[450px] border-2 border-customyellow p-[24px] md:p-[32px] flex flex-col justify-between">
              <div>
                <h3 className="text-[28px] md:text-[36px] font-h1">5 занятий</h3>
                <p className="text-[14px] md:text-[16px] mt-[12px] md:mt-[16px] leading-[20px] text-customyellow">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="text-[44px] md:text-[56px] font-h1 text-customyellow">4950₽</div>

              <button
                onClick={() => handleBuyPaid(5)}
                disabled={isLoading}
                className="bg-customyellow text-black text-[16px] md:text-[18px] font-bold hover:opacity-80 transition disabled:opacity-50"
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
            <div className="w-full sm:w-[300px] min-h-[450px] border-2 border-customyellow p-[24px] md:p-[32px] flex flex-col justify-between">
              <div>
                <h3 className="text-[28px] md:text-[36px] font-h1">10 занятий</h3>
                <p className="text-[14px] md:text-[16px] mt-[12px] md:mt-[16px] leading-[20px] text-customyellow">
                  Откройте для себя искусство владения клинком.
                  От базовых стоек до изящных атак.
                </p>
              </div>

              <div className="text-[44px] md:text-[56px] font-h1 text-customyellow">9900₽</div>

              <button
                onClick={() => handleBuyPaid(10)}
                disabled={isLoading}
                className="bg-customyellow text-black text-[16px] md:text-[18px] font-bold hover:opacity-80 transition disabled:opacity-50"
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