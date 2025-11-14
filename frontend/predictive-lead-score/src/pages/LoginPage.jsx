import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userData = await authService.login(username, password);

      if (onLoginSuccess) {
        onLoginSuccess(userData.user.name);
      }
      navigate('/dashboard'); 
    } catch (err) {
      console.error("Login gagal:", err);
      setError("Username atau password salah.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center min-w-[350px]">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Predictive Lead Scoring Portal</h2>
        <p className="mb-8 text-gray-600">Sign in to your account</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#85CC2C]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#85CC2C]"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button 
            type="submit" 
            className="w-full px-4 py-3 bg-[#85CC2C] text-white font-semibold rounded-md hover:bg-[#72b02a] transition duration-300 mt-6 text-lg"
          >
            Log in
          </button>
          <p className="mt-5 text-gray-600">
            <a href="/forgot-password" className="text-[#85CC2C] hover:underline">Forgot Password?</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;