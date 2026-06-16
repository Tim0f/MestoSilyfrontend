import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка входа. Проверьте данные.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="bg-customblack border border-customyellow/30 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-customwhite/30 rounded-full mb-4">
              <LogIn className="text-customyellow" size={32} />
            </div>
            <h1 className="text-h2 font-light text-customyellow">Вход</h1>
            <p className="text-white mt-2 font-light">Войдите в свой аккаунт</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full px-4 py-3 bg-customblack border border-customwhite/30 text-customwhite rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
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
                className="w-full px-4 py-3 bg-customblack border border-customwhite/30 text-customwhite rounded-lg focus:ring-2 focus:ring-customyellow focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-customyellow text-customblack py-3 rounded-lg font-light hover:bg-customyellow transition transform hover:scale-105"
            >
              Войти
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white font-light">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-customyellow font-light hover:text-customyellow">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
