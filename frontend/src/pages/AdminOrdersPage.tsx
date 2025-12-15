import { useEffect, useState } from "react";
import { HttpClient } from "../services/httpClient";
import { OrdersFrontendService } from "../services/orders.service";

const client = new HttpClient({
  baseUrl: import.meta.env.VITE_ADMIN_API_URL ?? "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});

const ordersService = new OrdersFrontendService(client);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingReceipts, setPendingReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const pending = await ordersService.getPendingReceipts<any[]>();
      setPendingReceipts(pending);

      const myOrders = await ordersService.findMyOrders<any[]>();
      setOrders(myOrders);
    } catch (err) {
      console.error("Ошибка загрузки заказов:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const redeemOrder = async (orderId: string) => {
    try {
      await ordersService.redeemReceipt(orderId);
      await load();
    } catch (err) {
      alert("Ошибка выдачи заказа");
      console.error(err);
    }
  };

  return (
    <div className="p-10 text-white space-y-10">
      <h1 className="text-3xl font-bold mb-6">Заказы</h1>

      {loading && <p className="text-white/60">Загрузка...</p>}

      {/* ===================== НЕВЫДАННЫЕ ЗАКАЗЫ ===================== */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">⏳ Невыданные заказы</h2>

        {pendingReceipts.length === 0 ? (
          <p className="text-white/50">Нет заказов в ожидании</p>
        ) : (
          pendingReceipts.map((r) => (
            <div
              key={r.id}
              className="p-4 border border-customyellow/40 rounded-lg bg-customgrey"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-xl">
                    Заказ #{r.order.id} — {r.order.totalAmount} зерен
                  </p>

                  <p className="text-white/70">
                    Покупатель: {r.order.user.firstName} {r.order.user.lastName}
                  </p>

                  <p className="mt-2 text-white/80 font-semibold">
                    Состав заказа:
                  </p>
                  <ul className="list-disc ml-6">
                    {r.order.orderItems.map((item: any) => (
                      <li key={item.id}>
                        {item.product.name} × {item.quantity} (
                        {item.product.price} зерен)
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => redeemOrder(r.orderId)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded"
                >
                  Выдать заказ
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===================== ВСЕ ЗАКАЗЫ ===================== */}
      <div className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">📦 Все заказы</h2>

        {orders.length === 0 ? (
          <p className="text-white/50">Нет заказов</p>
        ) : (
          orders.map((o) => {
            const receipt = o.receipts?.[0];

            const isPending = receipt?.status === "PENDING";
            const isRedeemed = receipt?.status === "REDEEMED";

            return (
              <div
                key={o.id}
                className={`p-4 rounded-lg border ${
                  isPending
                    ? "border-customyellow/40 bg-customgrey"
                    : "border-gray-500/30 bg-[#333333]"
                }`}
              >
                <p className="text-xl font-bold">
                  Заказ #{o.id} — {o.totalAmount} зерен
                </p>

                <p
                  className={`font-semibold mt-1 ${
                    isPending
                      ? "text-customyellow"
                      : isRedeemed
                      ? "text-green-400"
                      : "text-white/60"
                  }`}
                >
                  Статус чека:{" "}
                  {isPending ? "Ожидает выдачи" : "Выдан пользователю"}
                </p>

                <p className="mt-3 font-semibold">Состав заказа:</p>
                <ul className="list-disc ml-6">
                  {o.orderItems.map((item: any) => (
                    <li key={item.id}>
                      {item.product.name} × {item.quantity} (
                      {item.product.price} зерен)
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
