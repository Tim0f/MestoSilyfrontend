import React, { useEffect, useState } from "react";
import { HttpClient } from "../../services/httpClient";
import { GrainsFrontendService } from "../../services/grains.service";

interface Props {
  userId: string;
}

interface HistoryItem {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string) ||
    (import.meta.env.VITE_API_URL as string) ||
    "http://localhost:3000/api",
  getToken: () => localStorage.getItem("token") ?? undefined,
});

const grainsService = new GrainsFrontendService(client);

export default function GrainsHistoryTable({ userId }: Props) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const data: any = await grainsService.history(userId);
      setHistory(data);
    };
    load();
  }, [userId]);

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="text-gray-400">
          <th className="p-2">Дата</th>
          <th className="p-2">Изменение</th>
          <th className="p-2">Причина</th>
        </tr>
      </thead>
      <tbody>
        {history.map((item) => (
          <tr key={item.id} className="border-t border-white/10">
            <td className="p-2">{new Date(item.createdAt).toLocaleString()}</td>
            <td className="p-2">{item.amount}</td>
            <td className="p-2">{item.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
