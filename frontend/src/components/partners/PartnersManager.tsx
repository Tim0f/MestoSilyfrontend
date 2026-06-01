import { useEffect, useState, lazy, Suspense } from 'react';
import { Client } from '../../services/httpClient';
import { PartnersFrontendService } from '../../services/partners.service';
const PartnerCreateModal = lazy(() => import('./PartnersCreateModal'));
const PartnerEditModal = lazy(() => import('./PartnerEditModal'));

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
    <div className="p-6 text-customwhite">
      <h1 className="text-2xl font-bold mb-4">Партнёры</h1>

      <button
        onClick={() => setCreateOpen(true)}
        className="mb-4 px-4 py-2 bg-customyellow text-customblack rounded hover:bg-customyellow font-semibold"
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
              className="flex items-center justify-between bg-customgrey border border-customwhite/10 p-4 rounded-xl"
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
                  className="px-4 py-2 bg-[#3DA9FC] rounded hover:bg-[#5BC0EB]"
                >
                  Изменить
                </button>
                <button
                  onClick={() => removePartner(p.id)}
                  className="px-4 py-2 bg-[#D9534F] rounded hover:bg-red-500"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Suspense fallback={null}>
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

      </Suspense>

    </div>
  );
}
