import { useEffect, useState } from 'react'
import { Newspaper, Calendar } from 'lucide-react'
import { Client } from '../services/httpClient'

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
    Client.get<NewsItem[]>('/news')
      .then(setNews)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-customgrey">Загрузка новостей...</div>
      </div>
    )
  }

  return (
    <div className="bg-customblack min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-h1 mb-8">Новости</h1>

        {news.length === 0 ? (
          <div className="bg-customwhite rounded-xl shadow-lg p-12 text-center">
            <Newspaper size={64} className="mx-auto text-customgrey mb-4" />
            <p className="text-xl text-customgrey">Новостей пока нет</p>
          </div>
        ) : (
          <div className="space-y-8">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-customwhite rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
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
                    <div className="md:w-1/3 bg-gradient-to-br from-customyellow to-customyellow flex items-center justify-center p-8">
                      <Newspaper size={96} className="text-customyellow" />
                    </div>
                  )}

                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center gap-2 text-customgrey text-sm mb-3">
                      <Calendar size={16} />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className="text-h2 font-h1 mb-4 text-customwhite">
                      {item.title}
                    </h2>

                    <p className="text-customgrey leading-relaxed whitespace-pre-line">
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

