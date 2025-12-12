import React, { useState } from "react";
import { Client } from "../../services/httpClient";
import {
  ProductsFrontendService,
  type CreateProductDto,
} from "../../services/products.service";
import { UploadFrontendService } from "../../services/upload.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const client = Client;

const productsService = new ProductsFrontendService(client);
const uploadService = new UploadFrontendService(client);

export default function ProductCreateModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<CreateProductDto>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);

  const update = (k: keyof CreateProductDto, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }));

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files?.length) return;

  setUploading(true);
  const file = e.target.files[0];

  try {
    const res = await uploadService.image<{ filename: string }>(file);

    const url = uploadService.getFileUrl(res.filename);
    update("imageUrl", url);
  } finally {
    setUploading(false);
  }
};


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await productsService.create(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-customgrey border border-white/10 rounded-xl p-6 w-full max-w-xl text-white max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Создать товар</h2>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-1 text-customwhite">Название</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-customwhite">Цена (В зернах)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
              min={0}
              required
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />
          </div>

          {/* Загрузка изображения */}
          <div>
            <label className="block mb-1 text-customwhite">Изображение товара</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-[#222] border border-white/10 rounded px-3 py-2"
            />

            {uploading && <p className="text-yellow-400 mt-1">Загрузка...</p>}

            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                className="mt-2 w-32 h-32 object-cover rounded border border-white/20"
              />
            )}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
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
              className="px-4 py-2 bg-customyellow text-black rounded hover:bg-customyellow"
              disabled={uploading}
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
