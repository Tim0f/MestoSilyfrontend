import { useState, useEffect } from 'react'
import axios from 'axios'
import { Users, Clock } from 'lucide-react'

interface Section {
  id: number
  name: string
  description: string
  ageGroup: string
  teacherId: number
  teacher?: {
    name: string
  }
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await axios.get('/api/sections')
      setSections(response.data)
    } catch (error) {
      console.error('Ошибка загрузки секций:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Секции</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <h2 className="text-2xl font-bold mb-4 text-orange-600">{section.name}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Users size={18} />
                  <span>{section.ageGroup}</span>
                </div>
                
                {section.teacher && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={18} />
                    <span>Тренер: {section.teacher.name}</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">{section.description}</p>
              
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition">
                Записаться
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

