import { useEffect, useState, lazy, Suspense } from 'react';
import { Client } from '../../services/httpClient';
import { NewsFrontendService } from '../../services/news.service';
import { getPublicUrl } from '../../utils/publicUrl';
const NewsCreateModal = lazy(() => import('./NewsCreateModal'));
const NewsEditModal = lazy (() => import('./NewsEditModal'));

interface NewsItem {
  id: string;
  title: string;
  content: string;
  images: string[];
  imageUrl?: string;
  publishedAt: string;
  createdBy?: string;
}

const client = Client;
const newsService = new NewsFrontendService(client);

export default function NewsManager() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response: any = await newsService.findAll();

      console.log("News response:", response); // ← для дебага

      // Бэкенд возвращает объект вида { data: [...], meta: {...} }
      const list =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];

      setNews(list);
    } catch (err) {
      console.error('Ошибка загрузки новостей:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm('Удалить новость?')) return;
    await newsService.remove(id);
    load();
  };

  return (
    <div className="p-6 text-customwhite">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Новости</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-4 py-2 bg-customyellow text-customblack rounded hover:bg-customyellow"
        >
          Создать новость
        </button>
      </div>

      {loading ? (
        <p className="text-customwhite">Загрузка...</p>
      ) : (
        <div className="space-y-4">
          {news.map((n) => (
            <div
              key={n.id}
              className="bg-customgrey border border-customwhite/10 p-4 rounded-xl flex gap-4"
            >
              <div className="w-28 h-20 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={getPublicUrl(n.imageUrl || n.images?.[0])}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold">{n.title}</h2>
                  <div className="text-sm text-customgrey">
                    {new Date(n.publishedAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-customwhite mt-2 line-clamp-3">
                  {n.content}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setEditItem(n)}
                    className="px-3 py-1 bg-[#5BC0EB] rounded hover:bg-blue-400"
                  >
                    Редактировать
                  </button>

                  <button
                    onClick={() => remove(n.id)}
                    className="px-3 py-1 bg-red-500 rounded hover:bg-[#FF6B4A]"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!news.length && (
            <p className="text-customgrey">Новостей пока нет</p>
          )}
        </div>
      )}


<Suspense fallback={null}>
      <NewsCreateModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          load();
        }}
      />

      {editItem && (
        <NewsEditModal
          isOpen={!!editItem}
          onClose={() => {
            setEditItem(null);
            load();
          }}
          item={editItem}
        />
      )}

</Suspense>

    </div>
  );
}
