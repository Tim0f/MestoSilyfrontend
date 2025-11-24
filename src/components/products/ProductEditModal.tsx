import React, { useState } from 'react';
import { HttpClient } from '../../services/httpClient';
import {
  ProductsFrontendService,
  type UpdateProductDto,
} from '../../services/products.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isActive: boolean;
  };
}

const client = new HttpClient({
  baseUrl:
    (import.meta.env.VITE_ADMIN_API_URL as string | undefined) ??
    (import.meta.env.VITE_API_URL as string | undefined) ??
    'http://localhost:3000/api',
  getToken: () => localStorage.getItem('token') ?? undefined,
});

const productsService = new ProductsFrontendService(client);

export default function ProductEditModal({ isOpen, onClose, product }: Props) {
  const [form, setForm] = useState<UpdateProductDto>({
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    isActive: product.isActive,
  });

  const update = (k: keyof UpdateProductDto, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await productsService.update(product.id, form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 w-full max-w-xl text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Изменить товар</h2>

        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Цена (₽)</label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update('price', Number(e.target.value))}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">URL изображения</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update('isActive', e.target.checked)}
            />
            Активен
          </label>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Отмена
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
