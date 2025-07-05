'use client';

import { useEffect, useRef, useState } from 'react';
import { initiateSocketConnection, sendMessage, receiveMessage } from '../../../utils/socket';

export default function ChatPopup({ onClose }) {
  const [message, setMessage] = useState('');
  const [oldMessages, setOldMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const loadMessages = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOldMessages(data.map((msg) => ({ from: msg.from, text: msg.message })));
      } catch (error) {
        console.error('❌ Error loading old messages:', error);
      }
    };

    loadMessages();
    initiateSocketConnection(token);
    receiveMessage((data) => {
      setNewMessages((prev) => [...prev, { from: data.from, text: data.message }]);
    });
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [oldMessages, newMessages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setNewMessages((prev) => [...prev, { from: 'You', text: message }]);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl relative">
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">💬 MindEase Chat</h2>
        <div
          ref={chatBoxRef}
          className="h-80 overflow-y-auto bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4"
        >
          <h4 className="text-xs font-semibold text-gray-400 mb-2">Previous Messages</h4>
          {oldMessages.map((msg, i) => (
            <div
              key={`old-${i}`}
              className={`mb-1 text-sm ${msg.from === 'You' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              <span className="font-medium">{msg.from}:</span> {msg.text}
            </div>
          ))}
          {newMessages.length > 0 && (
            <>
              <hr className="my-2 border-gray-300" />
              <h4 className="text-xs font-semibold text-gray-500 mb-2">Live Chat</h4>
              {newMessages.map((msg, i) => (
                <div
                  key={`new-${i}`}
                  className={`mb-1 text-sm ${
                    msg.from === 'You' ? 'text-green-700 font-semibold' : 'text-gray-800'
                  }`}
                >
                  <span className="font-medium">{msg.from}:</span> {msg.text}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 text-sm font-medium rounded-xl transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
