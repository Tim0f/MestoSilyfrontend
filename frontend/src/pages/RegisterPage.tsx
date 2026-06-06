import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    if (!dateOfBirth) {
      setError('Укажите дату рождения');
      return;
    }

    if (!phone) {
      setError('Укажите номер телефона');
      return;
    }

    if (!firstName || !lastName) {
      setError('Укажите имя и фамилию');
      return;
    }

    try {
      await register(email, password, firstName, lastName, phone, dateOfBirth);
      // After registration, redirect to login page with success message
      navigate('/login', { state: { message: 'Регистрация успешна! Войдите в аккаунт.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации. Попробуйте снова.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="bg-dark-800 border border-customyellow/30 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-customyellow/30 rounded-full mb-4">
              <UserPlus className="text-customyellow" size={32} />
            </div>
            <h1 className="text-h2 font-light text-customyellow">Регистрация</h1>
            <p className="text-customgrey mt-2 font-light">Создайте новый аккаунт</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-light text-customgrey mb-2">
                Имя
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border border-customyellow/30 text-customblack rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-light text-customgrey mb-2">
                Фамилия
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border border-customyellow/30 text-customblack rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
                placeholder="Ваша фамилия"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-light text-customgrey mb-2">
                Телефон
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border border-customyellow/30 text-customblack rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
                placeholder="+79001234567"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-light text-customgrey mb-2">
                Дата рождения
              </label>
              <input
                id="dateOfBirth"
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border border-customyellow/30 text-customblack rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
                placeholder="2010-01-01"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-light text-customgrey mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border border-customyellow/30 text-customblack rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-customgrey mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border border-customyellow/30 text-customblack rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-light text-customgrey mb-2">
                Подтвердите пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border border-customyellow/30 text-customblack rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-customyellow text-customblack py-3 rounded-lg font-light hover:bg-customyellow/80 transition transform hover:scale-105"
            >
              Зарегистрироваться
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-customyellow font-light">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-customyellow font-light hover:text-customyellow">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
