'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const router = useRouter();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/signup', formData);
      alert('Signup Successful');
      router.push('/login');
    } catch (err) {
      alert('Signup Failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 border-t-4 border-blue-400"
      >
        <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-4">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Start your journey with <span className="text-blue-600 font-medium">MindEase</span>
        </p>

        <label className="block mb-2 text-sm text-gray-600">Username</label>
        <input
          name="username"
          required
          placeholder="Enter your username"
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />

        <label className="block mb-2 text-sm text-gray-600">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />

        <label className="block mb-2 text-sm text-gray-600">Password</label>
        <input
          name="password"
          type="password"
          required
          placeholder="••••••••"
          onChange={handleChange}
          className="w-full px-4 py-2 mb-6 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-all duration-200 shadow-md"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}
