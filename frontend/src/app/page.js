'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white px-6 py-10 flex flex-col items-center">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">🌿 Welcome to MindEase</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your personal space for mental wellness, emotional expression, and self-growth. Take a step toward better mental health—every day.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Core Features */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-l-8 border-indigo-400">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">💡 Core Features</h2>
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>
              <span className="font-medium">Mood Tracking:</span> Check in daily and view your emotional patterns with color-coded history.
            </li>
            <li>
              <span className="font-medium">AI-Based Activity Suggestions:</span> Get personalized wellness suggestions like breathing exercises, journaling prompts, or meditations.
            </li>
            <li>
              <span className="font-medium">Anonymous Peer Support:</span> Share and connect safely in a moderated chat space.
            </li>
          </ul>
        </div>

        {/* Bonus Features */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-l-8 border-teal-400">
          <h2 className="text-2xl font-semibold text-teal-600 mb-4">🌟 Bonus Features</h2>
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            {/* <li>
              <span className="font-medium">Wearable Integration:</span> Sync data from Fitbit, Apple Watch, and more to track sleep, heart rate, and steps.
            </li> */}
            <li>
              <span className="font-medium">Gamification:</span> Earn points and badges for completing activities and keeping up your daily streak.
            </li>
          </ul>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="mt-12 space-x-4">
        <Link href="/signup">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-200 shadow-md">
            Sign Up
          </button>
        </Link>
        <Link href="/login">
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-200 shadow-md">
            Log In
          </button>
        </Link>
        {/* <Link href="/chat">
          <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-200 shadow-md">
            Go to Chat (after login)
          </button>
        </Link> */}
      </div>

      <footer className="mt-10 text-sm text-gray-500 text-center">
        🚀 Ready to take control of your mental wellness? Get started by signing up or logging in.
      </footer>
    </div>
  );
}
