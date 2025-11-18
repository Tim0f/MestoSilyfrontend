import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User,
  Calendar,
  ArrowRightLeft,
  Trophy,
  Clock,
  Gift,
} from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  type: string;
  sectionId?: number;
}

interface TodaySession {
  id: number;
  startTime: string;
  endTime: string;
  section: {
    name: string;
  };
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [todaySessions, setTodaySessions] = useState<TodaySession[]>([]);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [showTransferForm, setShowTransferForm] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAchievements();
    fetchTodaySessions();
  }, [isAuthenticated, navigate]);

  const fetchAchievements = async () => {
    try {
      const response = await axios.get('/api/users/me/achievements');
      setAchievements(response.data);
    } catch (error) {
      console.error('Ошибка загрузки достижений:', error);
    }
  };

  const fetchTodaySessions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`/api/users/me/sessions?date=${today}`);
      setTodaySessions(response.data);
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/grains/transfer', {
        recipientEmail,
        amount: parseInt(transferAmount, 10),
      });
      alert('Зёрна успешно переведены!');
      setTransferAmount('');
      setRecipientEmail('');
      setShowTransferForm(false);
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка при переводе');
    }
  };

  if (!user) {
    return null;
  }

  const generalAchievements = achievements.filter((a) => a.type === 'GENERAL');
  const sectionAchievements = achievements.filter((a) => a.type === 'SECTION');

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Профиль</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - основная информация */}
          <div className="lg:col-span-1 space-y-6">
            {/* Карточка пользователя */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName || 'User avatar'}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-5xl font-bold">
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <h2 className="text-2xl font-bold">{user.firstName || 'Anonymous'}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              {user.dateOfBirth && (
                <div className="flex items-center gap-2 text-gray-700 mb-4 justify-center">
                  <Calendar size={18} />
                  <span>
                    {new Date(user.dateOfBirth).toLocaleDateString('ru-RU')}
                  </span>
                  {new Date(user.dateOfBirth).getMonth() === new Date().getMonth() &&
                   new Date(user.dateOfBirth).getDate() === new Date().getDate() && (
                    <Gift size={18} className="text-orange-600 ml-2" />
                  )}
                </div>
              )}

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4 text-center">
                <div className="text-sm opacity-90 mb-1">Баланс зёрен</div>
                <div className="text-4xl font-bold">🌾 {user.grainBalance ?? 0}</div>
              </div>
            </div>

            {/* Перевод зёрен */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <button
                onClick={() => setShowTransferForm(!showTransferForm)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition"
              >
                <ArrowRightLeft size={20} />
                Перевести зёрна
              </button>

              {showTransferForm && (
                <form onSubmit={handleTransfer} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email получателя
                    </label>
                    <input
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Количество
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={user.grainBalance ?? 0}
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Отправить
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Правая колонка - расписание и достижения */}
          <div className="lg:col-span-2 space-y-6">
            {/* Расписание на сегодня */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock size={24} className="text-orange-600" />
                Расписание на сегодня
              </h3>

              {todaySessions.length === 0 ? (
                <p className="text-gray-600">Сегодня занятий нет</p>
              ) : (
                <div className="space-y-3">
                  {todaySessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4"
                    >
                      <div className="font-bold text-lg">{session.section.name}</div>
                      <div className="text-gray-700">
                        {new Date(session.startTime).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(session.endTime).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Достижения */}
            {(generalAchievements.length > 0 || sectionAchievements.length > 0) && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Trophy size={24} className="text-orange-600" />
                  Достижения
                </h3>

                {generalAchievements.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-3">Общие достижения</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generalAchievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="bg-gradient-to-br from-yellow-100 to-yellow-200 border-2 border-yellow-400 rounded-lg p-4 flex items-start gap-3"
                        >
                          {achievement.imageUrl ? (
                            <img
                              src={achievement.imageUrl}
                              alt={achievement.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center text-3xl">
                              🏆
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold">{achievement.title}</h5>
                            <p className="text-sm text-gray-700">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sectionAchievements.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold mb-3">Достижения по секциям</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sectionAchievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-400 rounded-lg p-4 flex items-start gap-3"
                        >
                          {achievement.imageUrl ? (
                            <img
                              src={achievement.imageUrl}
                              alt={achievement.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-orange-400 rounded-lg flex items-center justify-center text-3xl">
                              🏀
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold">{achievement.title}</h5>
                            <p className="text-sm text-gray-700">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
