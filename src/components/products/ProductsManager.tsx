import React, { useEffect, useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import { ProductsFrontendService } from '../../services/products.service';
import ProductCreateModal from './ProductCreateModal';
import ProductEditModal from './ProductEditModal';

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const productsService = new ProductsFrontendService(client);

export default function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data: any = await productsService.findAll();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const removeProduct = async (id: string) => {
    await productsService.remove(id);
    load();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Товары</h1>

      <button
        onClick={() => setCreateOpen(true)}
        className="mb-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400 font-semibold"
      >
        Создать товар
      </button>

      {loading ? (
        <p>Загрузка…</p>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-[#111] border border-white/10 p-4 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div>
                  <p className="text-lg font-semibold">{p.name}</p>
                  <p className="text-gray-400 text-sm">{p.description}</p>
                  <p className="text-yellow-400 text-lg mt-1">{p.price} ₽</p>

                  <p className="text-sm mt-1">
                    {p.isActive ? (
                      <span className="text-green-400 font-medium">🟢 Активен</span>
                    ) : (
                      <span className="text-red-400 font-medium">🔴 Не активен</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditProduct(p)}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
                >
                  Изменить
                </button>

                <button
                  onClick={() => removeProduct(p.id)}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-500"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductCreateModal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          load();
        }}
      />

      {editProduct && (
        <ProductEditModal
          isOpen={!!editProduct}
          onClose={() => {
            setEditProduct(null);
            load();
          }}
          product={editProduct}
        />
      )}
    </div>
  );
}
