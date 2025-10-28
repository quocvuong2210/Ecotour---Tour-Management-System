import React, { useState } from 'react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      setAuthUser(data.user, data.token);
      // Trigger window close event to close modal
      window.dispatchEvent(new Event('auth-success'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập email của bạn"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 font-semibold">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Nhập mật khẩu"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Chưa có tài khoản?{' '}
        <button
          onClick={() => onSwitchToRegister(true)}
          className="text-teal-600 hover:underline"
        >
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
}

export default Login;

