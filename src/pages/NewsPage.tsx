import { useState, useEffect } from 'react'
import axios from 'axios'
import { Newspaper, Calendar } from 'lucide-react'

interface NewsItem {
  id: number
  title: string
  content: string
  imageUrl?: string
  createdAt: string
  mediaUrls?: string[]
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news')
      setNews(response.data)
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка новостей...</div>
      </div>
    )
  }

  return (
    <div className="bg-[#2D282A] min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-h1 mb-8">Новости</h1>

        {news.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Newspaper size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">Новостей пока нет</p>
          </div>
        ) : (
          <div className="space-y-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="md:flex">
                  {item.imageUrl ? (
                    <div className="md:w-1/3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/3 bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center p-8">
                      <Newspaper size={96} className="text-orange-600" />
                    </div>
                  )}

                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                      <Calendar size={16} />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className="text-3xl font-h1 mb-4 text-gray-900">
                      {item.title}
                    </h2>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>

                    {item.mediaUrls && item.mediaUrls.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {item.mediaUrls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`${item.title} - ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

