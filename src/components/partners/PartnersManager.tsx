import React, { useEffect, useState } from 'react';
import { Client } from '../../services/httpClient';
import { PartnersFrontendService } from '../../services/partners.service';
import PartnerCreateModal from './PartnersCreateModal';
import PartnerEditModal from './PartnerEditModal';

const client = Client

const partnersService = new PartnersFrontendService(client);

export default function PartnersManager() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editPartner, setEditPartner] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data: any = await partnersService.findAll();
      setPartners(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removePartner = async (id: string) => {
    await partnersService.remove(id);
    load();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Партнёры</h1>

      <button
        onClick={() => setCreateOpen(true)}
        className="mb-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 font-semibold"
      >
        Создать партнёра
      </button>

      {loading ? (
        <p>Загрузка…</p>
      ) : (
        <div className="space-y-4">
          {partners.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-[#111] border border-white/10 p-4 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">{p.name}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditPartner(p)}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                >
                  Изменить
                </button>
                <button
                  onClick={() => removePartner(p.id)}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PartnerCreateModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          load();
        }}
      />

      {editPartner && (
        <PartnerEditModal
          isOpen={!!editPartner}
          onClose={() => {
            setEditPartner(null);
            load();
          }}
          partner={editPartner}
        />
      )}
    </div>
  );
}
