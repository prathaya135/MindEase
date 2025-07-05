'use client';

import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';

export default function NavBar({ username = 'User', streak = 0 }) {  
  const router = useRouter();

  const handleLogout = () => {
    // Clear token/localStorage/session
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="w-full bg-white flex items-center justify-between px-6 py-3 rounded-xl">
      {/* Username */}
      <div className="flex items-center space-x-2 text-gray-700 font-semibold cursor-pointer transition duration-200 hover:text-gray-900"
        onClick={() => router.push('/profile')}
      >
        <FaUserCircle className="text-xl" />
        <span>{username}</span>
      </div>

      {/* Streak */}
      <div className="flex items-center space-x-2 font-semibold text-gray-700">
        <span>Streak</span>
        <span>{streak}</span>
        <span className="text-orange-500 text-lg">🔥</span>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-semibold cursor-pointer transition duration-200"
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    </div>
  );
}
