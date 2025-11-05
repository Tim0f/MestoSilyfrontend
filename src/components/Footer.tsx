import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-300 mt-12 border-t border-primary-900/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-light text-primary-400 mb-4">О месте</h3>
            <p className="text-gray-400 font-light">
              Место силы - пространство для комфорта и развития.
              Секции и мероприятия для всех.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-light text-primary-400 mb-4">Контакты</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Phone size={18} />
                <span className="font-light">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={18} />
                <span className="font-light">info@mestosily.ru</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-light text-primary-400 mb-4">Наша площадка</h3>
            <div className="flex items-start gap-2 text-gray-400">
              <MapPin size={18} className="mt-1 flex-shrink-0" />
              <div className="font-light">
                <p>г. Москва</p>
                <p>Природная территория</p>
                <p>Экопарк "Место силы"</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-900/30 mt-8 pt-6 text-center text-gray-500">
          <p className="font-light">&copy; {new Date().getFullYear()} Место силы. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

