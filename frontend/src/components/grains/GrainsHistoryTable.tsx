
interface HistoryItem {
  id: string;
  amount: number;
  reason: string;
  type: string;
  createdAt: string;
}

interface Props {
  history: HistoryItem[];
}

export function GrainsHistoryTable({ history }: Props) {
  return (
    <table className="w-full border border-customwhite/10 text-left">
      <thead>
        <tr className="bg-customblack">
          <th className="px-3 py-2">Дата</th>
          <th className="px-3 py-2">Тип</th>
          <th className="px-3 py-2">Сумма</th>
          <th className="px-3 py-2">Причина</th>
        </tr>
      </thead>
      <tbody>
        {history.map((item) => (
          <tr key={item.id} className="border-t border-customwhite/10">
            <td className="px-3 py-2">{new Date(item.createdAt).toLocaleString()}</td>
            <td className="px-3 py-2">{item.type}</td>
            <td className="px-3 py-2">{item.amount}</td>
            <td className="px-3 py-2">{item.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
