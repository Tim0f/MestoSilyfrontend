import { useEffect, useState } from "react";
import Logo2 from "../assets/svg/Logo2.svg";
import { ProductsFrontendService } from "../services/products.service";
import { OrdersFrontendService } from "../services/orders.service";
import { HttpClient } from "../services/httpClient";

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_API_URL as string | undefined) ??
    "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});

const productsService = new ProductsFrontendService(client);
const ordersService = new OrdersFrontendService(client);

export default function BazarPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const res = await productsService.findAll<any[]>();
      setProducts(res);
    } catch (err) {
      console.error("Ошибка загрузки товаров:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const buy = async (productId: string) => {
    try {
      const order = await ordersService.create({
        items: [
          {
            productId, // ← корректное поле под твой backend DTO
            quantity: 1,
          },
        ],
      });

      alert("Покупка прошла успешно! Чек отправлен на почту.");
      console.log("Order success:", order);
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Ошибка при покупке");
    }
  };

  if (loading)
    return (
      <div className="text-white text-center mt-20">Загрузка товаров...</div>
    );

  return (
    <div className="w-full min-h-screen bg-[#2D282A] text-white p-6">
      {/* Заголовок */}
      <div className="text-center mb-10 mt-10">
        <h1 className="text-5xl font-h1 mb-2 text-customyellow tracking-wider">
          БАЗАР
        </h1>
        <p className="text-primary-300 text-lg max-w-xl mx-auto opacity-80">
          При покупке вам придёт чек на почту, который нужно показать там, где
          можно материализовать покупку
        </p>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-[#151212] rounded-xl border border-primary-300/30 p-4 shadow-md relative"
          >
            {/* Цена */}
            <div className="absolute top-3 right-3 bg-[#f6c98f] text-black font-h1 px-3 py-1 rounded-md shadow flex items-center">
              {item.price}
              <img
                src={Logo2}
                className="w-[20px]"
                style={{
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  color: "black",
                  height: "10px",
                  width: "10px",
                }}
              />
            </div>

            {/* Картинка */}
            <div className="w-full h-40 bg-gray-300/30 rounded-lg mb-4 overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700/40" />
              )}
            </div>

            <h2 className="text-xl font-h1 mb-1">{item.name}</h2>
            <p className="text-sm text-primary-300 mb-4">{item.description}</p>

            <button
              onClick={() => buy(item.id)}
              className="w-full bg-[#f6c98f] text-black font-h1 py-2 rounded-md mt-auto hover:brightness-90"
            >
              купить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
