'use client';
import { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import NavBar from '@/component/navbar/navbar'; // Adjust path if needed
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    console.log('Fetching profile with token:', token);
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('Profile data:', data);
      if (res.ok) {
        setUser(data);
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const redeemCameraPoints = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/redeem-camera', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(prev => ({ ...prev, points: data.pointsLeft }));
        setLogs(prev => [...prev, { date: new Date().toDateString(), message: 'Redeemed 10 points for camera access' }]);
        setShowCamera(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error redeeming points:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-3 flex flex-col items-center">
      <div className="w-full width-full">
        <NavBar username={user?.username} streak={user?.streak} />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* LEFT SIDE: Profile + Camera Access */}
            <div className="space-y-8">
              {/* Profile Card */}
              <div className="bg-white shadow rounded-2xl p-6">
                <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>
                <p><strong>Username:</strong> {user?.username}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Streak:</strong> 🔥 {user?.streak} days</p>
                <p><strong>Points:</strong> ⭐ {user?.points}</p>
              </div>

              {/* Camera Access */}
              <div className="bg-white shadow rounded-2xl p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">🎥 Real-Time Mood Detection</h2>
                <button
                  onClick={()=> router.push('/home')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Use 10 Points to Access Camera
                </button>
              </div>
            </div>

            {/* RIGHT SIDE: Logs */}
            <div className="bg-white shadow rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">📋 Activity Log</h2>
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {logs.map((log, index) => (
                    <li key={index} className="border-b pb-2">
                      <strong>{new Date(log?.date).toDateString()}</strong> — {log?.message || log?.action}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white text-black rounded-2xl p-6 shadow-lg max-w-lg w-full relative">
              <h3 className="text-lg font-semibold mb-4 text-center">📸 Camera Access</h3>
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                className="rounded-xl w-full h-64 object-cover mb-4"
              />
              <button
                onClick={() => setShowCamera(false)}
                className="absolute top-2 right-4 text-xl text-gray-600 hover:text-red-500"
              >
                ✖
              </button>
              <p className="text-sm text-gray-500 text-center">
                *Mood detection logic can be applied on top.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
