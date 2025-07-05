// 'use client';

// import { useEffect, useState,useRef } from 'react';
// import Webcam from 'react-webcam';
// import { useRouter } from 'next/navigation';
// import NavBar from '@/component/navbar/navbar';
// import ChatPopup from '@/component/chat/chat';

// export default function MoodAndChatPage() {
//   const [showMoodSlider, setShowMoodSlider] = useState(true);
//   const [showCameraPopup, setShowCameraPopup] = useState(false);
//   const [showChatPopup, setShowChatPopup] = useState(false);
//   const [mood, setMood] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedVideoId, setSelectedVideoId] = useState(null);
//   const [user, setUser] = useState(null);
//   const router = useRouter();
//   const webcamRef = useRef(null);

//   const moods = ['😣', '😕', '😐', '🙂', '😊', '😁'];
//   const moodKeywords = ['sad', 'confused', 'neutral', 'okay', 'happy', 'excited'];

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await fetch('http://localhost:5000/api/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error('Unauthorized');

//         const data = await res.json();
//         setUser(data);
//       } catch (err) {
//         console.error('❌ Failed to fetch profile:', err);
//         alert('Failed to load profile. Please log in again.');
//       }
//     };

//     fetchProfile();
//   }, []);


//   const fetchSuggestions = async (moodIndex) => {
//     const moodKeywordOptions = [
//       // 😣 Very Stressed
//       ["stress relief music", "relaxing nature sounds", "deep breathing guide", "peaceful piano music"],
//       // 😕 Sad/Confused
//       ["calming meditation", "emotional healing songs", "soothing background music", "uplifting speeches"],
//       // 😐 Neutral
//       ["neutral mood songs", "light instrumental", "chill background music", "soft jazz"],
//       // 🙂 Slightly Happy
//       ["happy upbeat music", "acoustic pop", "positive vibes songs", "good mood playlist"],
//       // 😊 Happy
//       ["feel good motivation", "morning energy music", "happy dance songs", "confidence boost songs"],
//       // 😁 Excited/Celebrating
//       ["celebration songs", "party music", "victory anthem", "hype playlist"]
//     ];

//     // Randomly pick a keyword from the selected mood
//     const keywordOptions = moodKeywordOptions[moodIndex];
//     const keyword = keywordOptions[Math.floor(Math.random() * keywordOptions.length)];

//     const apiKey = "AIzaSyBEIloCieh5ow2ViAKyGhETSvnwIhtr7uw";

//     const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
//       keyword
//     )}&type=video&maxResults=3&key=${apiKey}`;

//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       setSuggestions(data.items || []);
//     } catch (error) {
//       console.error("YouTube API fetch error:", error);
//     }
//   };



//   const handleMoodSubmit = () => {
//     if (mood !== null) {
//       alert(`Mood submitted: ${moods[mood]}`);
//       fetchSuggestions(mood);
//     } else {
//       alert('Please select a mood first.');
//     }
//   };

//   const handleCameraMoodDetection = () => {
//     const interval = setInterval(async () => {
//       if (webcamRef.current) {
//         const screenshot = webcamRef.current.getScreenshot();

//         if (screenshot) {
//           // Convert base64 image to Blob
//           const blob = await (await fetch(screenshot)).blob();
//           const formData = new FormData();
//           formData.append('image', blob, 'frame.jpg');

//           try {
//             const res = await fetch('http://localhost:5000/predict', {
//               method: 'POST',
//               body: formData,
//             });

//             const data = await res.json();
//             if (data.emotion) {
//               const detectedIndex = emotionToIndex(data.emotion);
//               if (detectedIndex !== -1) {
//                 setMood(detectedIndex);
//                 fetchSuggestions(detectedIndex);
//                 clearInterval(interval); // Stop after one detection, or keep if continuous
//               }
//             } else {
//               console.warn('No face detected.');
//             }
//           } catch (err) {
//             console.error('Prediction error:', err);
//           }
//         }
//       }
//     }, 2000); // Adjust interval as needed
//   };

// // Maps emotion labels from Flask to mood index
//   const emotionToIndex = (emotion) => {
//     const emotionMap = {
//       'Angry': 0,
//       'Disgusted': 1,
//       'Fearful': 1,
//       'Neutral': 2,
//       'Happy': 4,
//       'Sad': 0,
//       'Surprised': 5,
//     };
//     return emotionMap[emotion] ?? -1;
//   };


//   useEffect(() => {
//     if (showCameraPopup) {
//       handleCameraMoodDetection();
//     }
//   }, [showCameraPopup]);

//   useEffect(() => {
//     if (mood !== null) {
//       fetchSuggestions(mood);
//     }
//   }, [mood]);

//   if (!user) return <div className="text-center p-6">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-900 p-3 flex flex-col items-center">
//       <div className="w-full">
//         <NavBar username={user?.username} streak={user?.streak} />
//         <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">

//             {/* Mood Option Box */}
//             <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
//               <h2 className="text-lg font-semibold mb-4">How would you like to log your mood?</h2>
//               <div className="flex space-x-6">
//                 <button
//                   onClick={() => {
//                     setShowMoodSlider(true);
//                     setShowCameraPopup(false);
//                   }}
//                   className="bg-blue-100 text-gray-800 rounded-xl p-4 w-36 h-36 flex flex-col items-center justify-center hover:bg-blue-200 transition"
//                 >
//                   <span className="text-4xl mb-2">🙂</span>
//                   <span className="text-sm font-semibold text-center">Log mood manually</span>
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowCameraPopup(true);
//                     setShowMoodSlider(true);
//                   }}
//                   className="bg-purple-100 text-gray-800 rounded-xl p-4 w-36 h-36 flex flex-col items-center justify-center hover:bg-purple-200 transition"
//                 >
//                   <span className="text-4xl mb-2">👤</span>
//                   <span className="text-sm font-semibold text-center">Detect via Camera</span>
//                 </button>
//               </div>
//             </div>

//             {/* Suggestions Box */}
//             <div className="bg-white rounded-2xl p-6 shadow-md">
//               <h2 className="text-lg font-semibold mb-4">Suggestions</h2>
//                 {suggestions.length === 0 ? (
//                   <p className="text-gray-500">No suggestions yet.</p>
//                 ) : (
//                   <div className="space-y-2">
//                     {suggestions.map((item, index) => (
//                       <div
//                         key={index}
//                         onClick={() => setSelectedVideoId(item.id.videoId)}
//                         className="cursor-pointer bg-gray-100 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-200 transition"
//                       >
//                         <img
//                           src={item.snippet.thumbnails.default.url}
//                           alt={item.snippet.title}
//                           className="w-20 h-12 rounded"
//                         />
//                         <div>
//                           <p className="text-sm font-bold">{item.snippet.title}</p>
//                           <p className="text-xs text-gray-500">{item.snippet.channelTitle}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//             {/* Mood Slider Box */}
//             {showMoodSlider && (
//               <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
//                 <h2 className="text-lg font-semibold mb-4">How are you feeling today?</h2>
//                 <div className="flex space-x-4 text-3xl mb-4">
//                   {moods.map((emoji, idx) => (
//                     <button
//                       key={idx}
//                       onClick={() => {
//                         if (!showCameraPopup) setMood(idx);
//                       }}
//                       disabled={showCameraPopup}
//                       className={`transition transform ${
//                         mood === idx ? 'scale-125' : 'opacity-50 hover:opacity-100'
//                       } ${showCameraPopup ? 'cursor-not-allowed opacity-30' : ''}`}
//                     >
//                       {emoji}
//                     </button>
//                   ))}
//                 </div>
//                 <button
//                   onClick={handleMoodSubmit}
//                   className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
//                 >
//                   Submit
//                 </button>
//               </div>
//             )}

//             {/* Chat Room Box */}
//             <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center justify-center">
//               <h2 className="text-lg font-semibold mb-4">Chat Room</h2>
//               <div className="w-full flex justify-center">
//                 <button
//                   onClick={() => setShowChatPopup(true)}
//                   className="bg-indigo-500 hover:bg-indigo-600 text-white w-48 py-2 rounded-full font-semibold transition"
//                 >
//                   Common Chat
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Camera Modal */}
//           {showCameraPopup && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//               <div className="bg-white text-black rounded-2xl p-6 shadow-lg max-w-lg w-full relative">
//                 <h3 className="text-lg font-semibold mb-4 text-center">🎥 Real-Time Mood Detection</h3>
//                 <Webcam
//                   audio={false}
//                   screenshotFormat="image/jpeg"
//                   className="rounded-xl w-full h-64 object-cover mb-4"
//                 />
//                 <button
//                   onClick={() => setShowCameraPopup(false)}
//                   className="absolute top-2 right-4 text-xl text-gray-600 hover:text-red-500"
//                 >
//                   ✖
//                 </button>
//                 <p className="text-sm text-gray-500 text-center">
//                   *Camera only shows preview. Mood detection logic not yet applied.
//                 </p>
//               </div>
//             </div>
//           )}

//           {showChatPopup && <ChatPopup onClose={() => setShowChatPopup(false)} />}

//           {selectedVideoId && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl p-4 shadow-lg w-full max-w-3xl relative">
//               <button
//                 onClick={() => setSelectedVideoId(null)}
//                 className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-red-500"
//               >
//                 ✖
//               </button>
//               <h3 className="text-lg font-semibold text-center mb-4">🎥 Now Playing</h3>
//               <div className="w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
//                 <iframe
//                   src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
//                   title="YouTube video player"
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                   className="w-full h-80"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import NavBar from '@/component/navbar/navbar';
import ChatPopup from '@/component/chat/chat';

export default function MoodAndChatPage() {
  const [showMoodSlider, setShowMoodSlider] = useState(true);
  const [showCameraPopup, setShowCameraPopup] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [mood, setMood] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const webcamRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const moods = ['😣', '😕', '😐', '🙂', '😊', '😁'];
  const moodKeywords = ['sad', 'confused', 'neutral', 'okay', 'happy', 'excited'];

  const emotionToIndex = (emotion) => {
    const emotionMap = {
      'Angry': 0,
      'Disgusted': 1,
      'Fearful': 1,
      'Neutral': 2,
      'Happy': 4,
      'Sad': 0,
      'Surprised': 5,
    };
    return emotionMap[emotion] ?? -1;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
        alert('Failed to load profile. Please log in again.');
      }
    };

    fetchProfile();
  }, []);

  const fetchSuggestions = async (moodIndex) => {
    const moodKeywordOptions = [
      ["stress relief music", "relaxing nature sounds", "deep breathing guide", "peaceful piano music"],
      ["calming meditation", "emotional healing songs", "soothing background music", "uplifting speeches"],
      ["neutral mood songs", "light instrumental", "chill background music", "soft jazz"],
      ["happy upbeat music", "acoustic pop", "positive vibes songs", "good mood playlist"],
      ["feel good motivation", "morning energy music", "happy dance songs", "confidence boost songs"],
      ["celebration songs", "party music", "victory anthem", "hype playlist"]
    ];

    const keywordOptions = moodKeywordOptions[moodIndex];
    const keyword = keywordOptions[Math.floor(Math.random() * keywordOptions.length)];

    const apiKey = "AIzaSyBEIloCieh5ow2ViAKyGhETSvnwIhtr7uw";
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      keyword
    )}&type=video&maxResults=3&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.items || []);
    } catch (error) {
      console.error("YouTube API fetch error:", error);
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
    } catch (error) {
      console.error('Error redeeming points:', error);
    }
  };

  const handleMoodSubmit = () => {
    if (mood !== null) {
      alert(`Mood submitted: ${moods[mood]}`);
      fetchSuggestions(mood);
    } else {
      alert('Please select a mood first.');
    }
  };

  const handleCameraMoodDetection = () => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);

    detectionIntervalRef.current = setInterval(async () => {
      if (webcamRef.current) {
        const screenshot = webcamRef.current.getScreenshot();
        if (!screenshot) return;

        const blob = await (await fetch(screenshot)).blob();
        const formData = new FormData();
        formData.append('image', blob, 'frame.jpg');

        try {
          const res = await fetch('http://localhost:4000/predict', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (data.emotion) {
            const index = emotionToIndex(data.emotion);
            if (index !== -1) {
              setMood(index);
              fetchSuggestions(index);
              redeemCameraPoints(); // Redeem points after successful detection
              setShowCameraPopup(false); // Close camera popup after detection
              clearInterval(detectionIntervalRef.current); // Stop after first detection
            }
          }
        } catch (err) {
          console.error('Prediction error:', err);
        }
      }
    }, 2000); // every 2 seconds
  };

  useEffect(() => {
    if (showCameraPopup) {
      handleCameraMoodDetection();
    } else {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    }
  }, [showCameraPopup]);

  useEffect(() => {
    if (mood !== null) {
      fetchSuggestions(mood);
    }
  }, [mood]);

  if (!user) return <div className="text-center p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-3 flex flex-col items-center">
      <div className="w-full">
        <NavBar username={user?.username} streak={user?.streak} />
        <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">How would you like to log your mood?</h2>
              <div className="flex space-x-6">
                <button
                  onClick={() => {
                    setShowMoodSlider(true);
                    setShowCameraPopup(false);
                  }}
                  className="bg-blue-100 text-gray-800 rounded-xl p-4 w-36 h-36 flex flex-col items-center justify-center hover:bg-blue-200 transition"
                >
                  <span className="text-4xl mb-2">🙂</span>
                  <span className="text-sm font-semibold text-center">Log mood manually</span>
                </button>
                <button
                  onClick={() => {
                    setShowCameraPopup(true);
                    setShowMoodSlider(true);
                  }}
                  className="bg-purple-100 text-gray-800 rounded-xl p-4 w-36 h-36 flex flex-col items-center justify-center hover:bg-purple-200 transition"
                >
                  <span className="text-4xl mb-2">👤</span>
                  <span className="text-sm font-semibold text-center">Detect via Camera</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold mb-4">Suggestions</h2>
              {suggestions.length === 0 ? (
                <p className="text-gray-500">No suggestions yet.</p>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedVideoId(item.id.videoId)}
                      className="cursor-pointer bg-gray-100 rounded-lg p-3 flex items-center space-x-3 hover:bg-gray-200 transition"
                    >
                      <img
                        src={item.snippet.thumbnails.default.url}
                        alt={item.snippet.title}
                        className="w-20 h-12 rounded"
                      />
                      <div>
                        <p className="text-sm font-bold">{item.snippet.title}</p>
                        <p className="text-xs text-gray-500">{item.snippet.channelTitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {showMoodSlider && (
              <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-4">How are you feeling today?</h2>
                <div className="flex space-x-4 text-3xl mb-4">
                  {moods.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!showCameraPopup) setMood(idx);
                      }}
                      disabled={showCameraPopup}
                      className={`transition transform ${
                        mood === idx ? 'scale-125' : 'opacity-50 hover:opacity-100'
                      } ${showCameraPopup ? 'cursor-not-allowed opacity-30' : ''}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleMoodSubmit}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
                >
                  Submit
                </button>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center justify-center">
              <h2 className="text-lg font-semibold mb-4">Chat Room</h2>
              <div className="w-full flex justify-center">
                <button
                  onClick={() => setShowChatPopup(true)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white w-48 py-2 rounded-full font-semibold transition"
                >
                  Common Chat
                </button>
              </div>
            </div>
          </div>

          {/* Camera Modal */}
          {showCameraPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white text-black rounded-2xl p-6 shadow-lg max-w-lg w-full relative">
                <h3 className="text-lg font-semibold mb-4 text-center">🎥 Real-Time Mood Detection</h3>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="rounded-xl w-full h-64 object-cover mb-4"
                />
                <button
                  onClick={() => setShowCameraPopup(false)}
                  className="absolute top-2 right-4 text-xl text-gray-600 hover:text-red-500"
                >
                  ✖
                </button>
                <p className="text-sm text-gray-500 text-center">
                  *Camera is detecting your mood in real-time.
                </p>
              </div>
            </div>
          )}

          {showChatPopup && <ChatPopup onClose={() => setShowChatPopup(false)} />}

          {selectedVideoId && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-4 shadow-lg w-full max-w-3xl relative">
                <button
                  onClick={() => setSelectedVideoId(null)}
                  className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-red-500"
                >
                  ✖
                </button>
                <h3 className="text-lg font-semibold text-center mb-4">🎥 Now Playing</h3>
                <div className="w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-80"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
