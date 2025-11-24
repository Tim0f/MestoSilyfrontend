import React from 'react';

interface Props {
  rows: any[]; // expected: id, fromUser, toUser, amount, message, createdAt
  loading?: boolean;
}

export default function GrainsTransfersTable({ rows, loading }: Props) {
  if (loading) return <div className="text-gray-400">Загрузка...</div>;
  if (!rows || !rows.length) return <div className="text-gray-400">Переводов нет</div>;

  return (
    <div className="bg-[#111] border border-white/10 rounded-xl overflow-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-400">
            <th className="px-4 py-3">Дата</th>
            <th className="px-4 py-3">От</th>
            <th className="px-4 py-3">Кому</th>
            <th className="px-4 py-3">Сумма</th>
            <th className="px-4 py-3">Сообщение</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id ?? i} className="border-t border-white/5">
              <td className="px-4 py-3 text-sm">{new Date(r.createdAt || r.date || r.timestamp).toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">{r.fromUser?.email ?? r.fromUserId ?? '—'}</td>
              <td className="px-4 py-3 text-sm">{r.toUser?.email ?? r.toUserId ?? '—'}</td>
              <td className="px-4 py-3 text-sm">{r.amount}</td>
              <td className="px-4 py-3 text-sm text-gray-300">{r.message ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
