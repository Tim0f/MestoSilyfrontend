import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { ShoppingCart, Check } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  stock: number
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [purchaseSuccess, setPurchaseSuccess] = useState<number | null>(null)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (productId: number, price: number) => {
    if (!isAuthenticated) {
      alert('Пожалуйста, войдите в систему для покупки товаров')
      return
    }

    if (!user || user.grainBalance < price) {
      alert('Недостаточно зёрен для покупки')
      return
    }

    try {
      await axios.post('/api/orders', {
        productId,
        quantity: 1,
      })
      setPurchaseSuccess(productId)
      setTimeout(() => setPurchaseSuccess(null), 3000)
      // Обновить баланс пользователя
      window.location.reload()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при покупке')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка товаров...</div>
      </div>
    )
  }

  return (
    <div className="bg-[#2D282A] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-h1">Магазин</h1>
          {isAuthenticated && user && (
            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="text-gray-600">Ваш баланс: </span>
              <span className="text-2xl font-h1 text-orange-600">🌾 {user.grainBalance}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                  <ShoppingCart size={64} className="text-orange-600" />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-h1 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4 h-12 overflow-hidden">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-h1 text-orange-600">
                    🌾 {product.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    В наличии: {product.stock}
                  </div>
                </div>

                {purchaseSuccess === product.id ? (
                  <button
                    disabled
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-h2 flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Куплено!
                  </button>
                ) : (
                  <button
                    onClick={() => handlePurchase(product.id, product.price)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 rounded-lg font-h2 transition ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                    }`}
                  >
                    {product.stock === 0 ? 'Нет в наличии' : 'Купить 1 шт'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">Товары скоро появятся</p>
          </div>
        )}
      </div>
    </div>
  )
}

