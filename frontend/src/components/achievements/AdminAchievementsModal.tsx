// src/components/achievements/AdminAchievementsModal.tsx

import { useEffect, useState } from "react";

import { Client } from "../../services/httpClient";

  

type Achievement = {

  id: string;

  name: string;

  code: string;

};

  

interface Props {

  isOpen: boolean;

  onClose: () => void;

}

  

export default function AdminAchievementsModal({ isOpen, onClose }: Props) {

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState<Achievement | null>(null);

  const [loading, setLoading] = useState(false);

  

  useEffect(() => {

    if (!isOpen) return;

  

    const load = async () => {

      setLoading(true);

      try {

        const data = await Client.get<Achievement[]>("/achievements");

        setAchievements(data ?? []);

      } catch (e) {

        console.error("Failed to load achievements:", e);

      } finally {

        setLoading(false);

      }

    };

  

    load();

  }, [isOpen]);

  

  const filtered = achievements.filter((a) =>

    a.name.toLowerCase().includes(search.toLowerCase())

  );

  

  if (!isOpen) return null;

  

  return (

    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">

      <div className="bg-customblack text-white w-full max-w-xl rounded-2xl p-6 shadow-xl border border-[#E0B26F]/30">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-3xl font-bold">🏆 Ачивки</h2>

          <button

            onClick={onClose}

            className="text-white text-xl hover:text-[#FF6B4A]"

          >

            ✖

          </button>

        </div>

  

        {/* SEARCH */}

        <input

          value={search}

          onChange={(e) => setSearch(e.target.value)}

          placeholder="Поиск ачивки..."

          className="w-full bg-[#3A3333] text-white rounded-lg px-4 py-3 mb-4 outline-none placeholder-white/40"

        />

  

        {/* LIST */}

        <div className="max-h-72 overflow-y-auto space-y-2 pr-2">

          {loading ? (

            <div className="text-white/50 text-center py-6">Загрузка...</div>

          ) : filtered.length === 0 ? (

            <div className="text-white/50 text-center py-6">Ничего не найдено</div>

          ) : (

            filtered.map((a) => (

              <button

                key={a.id}

                onClick={() => setSelected(a)}

                className="w-full text-left bg-[#3A3333] hover:bg-[#4A4141] rounded-lg px-4 py-3 transition"

              >

                <div className="font-semibold">{a.name}</div>

              </button>

            ))

          )}

        </div>

  

        {/* SELECTED */}

        {selected && (

          <div className="mt-6 bg-[#3A3333] rounded-xl p-4 border border-[#E0B26F]/40">

            <div className="text-lg font-semibold mb-2">{selected.name}</div>

            <div className="text-sm text-white/70 mb-2">Код для получения:</div>

  

            <div className="bg-black/30 rounded-lg p-3 font-mono text-[#E0B26F] text-lg tracking-wide">

              {selected.code}

            </div>

  

            <button

              className="mt-4 bg-[#E0B26F] text-black font-semibold px-4 py-2 rounded-xl hover:bg-[#d0a25f] transition"

              onClick={() => navigator.clipboard.writeText(selected.code)}

            >

              📋 Скопировать код

            </button>

          </div>

        )}

      </div>

    </div>

  );

}