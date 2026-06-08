import { useEffect, useState } from "react";
import { getPublicUrl } from "../utils/publicUrl";
import Zerno from "../assets/svg/Zerno.svg";
import { ProductsFrontendService } from "../services/products.service";
import { OrdersFrontendService } from "../services/orders.service";
import { Client } from "../services/httpClient";

const client = Client;
const productsService = new ProductsFrontendService(client);
const ordersService = new OrdersFrontendService(client);

export default function BazarPage() {
<<<<<<< HEAD

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

      <div className="w-full min-h-screen bg-customblack text-customwhite p-6 pt-16">

        {/* Заголовок */}

        <div className="text-center mb-10 mt-10">

          <h1 className="text-h1 font-h1 mb-2 text-customyellow tracking-wider">БАЗАР</h1>

          <p className="text-primary-300 text-lg max-w-xl mx-auto opacity-80">

            При покупке вам придёт чек на почту, который нужно показать там, где можно материализовать покупку

          </p>

          <h1>Товаров пока нет</h1>

        </div>

      </div>

    );

  

  return (

    <div className="w-full min-h-screen bg-customblack text-customwhite p-6">

      {/* Заголовок */}

      <div className="text-center mb-10 mt-10">

        <h1 className="text-h1 font-h1 mb-2 text-customyellow tracking-wider">

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
  className="relative w-full max-w-[442px] mx-auto min-h-[500px] textured-border overflow-hidden p-[10px] flex flex-col"
>
  {/* КАРТИНКА + ЦЕНА */}
  <div className="relative w-full h-[200px] flex-shrink-0">
    {item.imageUrl ? (
      <img
        src={getPublicUrl(item.imageUrl)}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-customgrey/40" />
    )}

    {/* Цена */}
    <div className="absolute top-1 right-0 bg-customyellow text-customblack w-[108px] h-[81px] rounded-md shadow flex items-center justify-center text-h2 font-h2">
      {item.price}
      <img src={Zerno} className="w-[30px] h-[30px]" />
    </div>
  </div>

  {/* КОНТЕНТ */}
  <div className="flex flex-col flex-1 p-[25px]">
    <h2 className="text-h2 font-h2 mb-2 break-words">{item.name}</h2>

    <p className="text-p mb-4 opacity-80 break-words">{item.description}</p>

    {/* КНОПКА */}
    <span
      onClick={() => buy(item.id)}
      className="mt-auto w-full bg-customyellow text-customblack font-p py-2 text-center hover:brightness-90 cursor-pointer"
    >
      купить
    </span>
  </div>
</div>
  
  

        ))}

      </div>

    </div>

  );

=======
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
            productId,
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
      <div className="w-full min-h-screen bg-customblack text-customwhite p-6 pt-16">
        <div className="text-center mb-10 mt-10">
          <h1 className="text-h1 font-h1 mb-2 text-customyellow tracking-wider">БАЗАР</h1>
          <p className="text-primary-300 text-lg max-w-xl mx-auto opacity-80">
            При покупке вам придёт чек на почту, который нужно показать там, где можно материализовать покупку
          </p>
          <h1>Товаров пока нет</h1>
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-customblack text-customwhite p-6">
      {/* Заголовок */}
      <div className="text-center mb-10 mt-10">
        <h1 className="text-h1 font-h1 mb-2 text-customyellow tracking-wider">
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
            className="relative w-[442px] h-[500px] textured-border overflow-hidden p-[10px]"
          >
            {/* КАРТИНКА + ЦЕНА */}
            <div className="relative w-full h-[210px] pt-[10px]">
              {item.imageUrl ? (
                <img
                  src={getPublicUrl(item.imageUrl)}
                  className="w-[387px] h-[200px] object-cover"
                />
              ) : (
                <div className="w-full h-full bg-customgrey/40" />
              )}

              {/* Цена */}
              <div className="absolute top-1 right-0 bg-customyellow text-customblack w-[108px] h-[81px] rounded-md shadow flex items-center justify-center text-h2 font-h2">
                {item.price}
                {/* Иконка зерна через маску – цвет customblack */}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: "rgb(var(--color-customblack))",
                    WebkitMaskImage: `url(${Zerno})`,
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskImage: `url(${Zerno})`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
              </div>
            </div>

            {/* КОНТЕНТ */}
            <div className="flex flex-col h-[calc(100%-210px)] p-[25px]">
              <h2 className="text-h2 font-h2 mb-2">{item.name}</h2>
              <p className="text-p mb-4 opacity-80">{item.description}</p>
              <span
                onClick={() => buy(item.id)}
                className="mt-auto w-full bg-customyellow text-customblack font-p py-2 text-center hover:brightness-90 cursor-pointer"
              >
                купить
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
>>>>>>> bad7590b2a12252f8a77b01574ca3dedd4d8323a
}