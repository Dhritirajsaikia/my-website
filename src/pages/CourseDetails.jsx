import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { Maximize, Lock, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const Loader = () => (
  <div className="flex flex-col items-center justify-center mt-12">
    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-indigo-600"></div>
    <p className="mt-4 text-xl font-semibold text-indigo-600">
      Loading course details...
    </p>
  </div>
);

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef(null);
  const progressUpdateInterval = useRef(null);

  // Get authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Check session token function: runs only when this page is active.
  const checkSessionToken = async () => {
    if (!user) return;
    const localToken = localStorage.getItem("sessionToken");
    const docSnap = await getDoc(doc(db, "users", user.uid));
    const data = docSnap.data();
    if (data && data.activeSessionToken && data.activeSessionToken !== localToken) {
      // If the page is in focus, sign out
      if (document.visibilityState === "visible") {
        await signOut(auth);
        alert("You have been logged out because your account was signed in on another device.");
        navigate("/");
      }
    }
  };

  // Run check on mount and when window gains focus
  useEffect(() => {
    // Check immediately when component mounts
    checkSessionToken();
    // Attach focus event handler
    window.addEventListener("focus", checkSessionToken);
    return () => window.removeEventListener("focus", checkSessionToken);
  }, [user, navigate]);

  // Prevent right-click and PrintScreen key
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screen recording is disabled.');
        navigator.clipboard.writeText('');
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Disable copy function within the video container
  useEffect(() => {
    const handleCopy = (e) => {
      const selection = window.getSelection();
      if (
        videoContainerRef.current &&
        selection.anchorNode &&
        videoContainerRef.current.contains(selection.anchorNode)
      ) {
        e.preventDefault();
        alert('Copy function is disabled on this video.');
      }
    };
    document.addEventListener('copy', handleCopy);
    return () => document.removeEventListener('copy', handleCopy);
  }, []);

  // Fetch course data from Firestore
  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    const fetchCourse = async () => {
      try {
        const courseRef = doc(db, 'courses', courseId);
        const docSnap = await getDoc(courseRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCourse(data);
          if (data.videos && data.videos.length > 0) {
            setSelectedVideo(data.videos[0]);
          }
        } else {
          setCourse(null);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Helper to extract YouTube video ID
  const extractYoutubeId = (url) => {
    if (typeof url !== 'string' || !url.trim()) return null;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Load YouTube IFrame API
  useEffect(() => {
    // Load the YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    // If API was already loaded previously
    if (window.YT && window.YT.Player) {
      initializePlayer();
    }

    return () => {
      // Clean up interval when component unmounts
      if (progressUpdateInterval.current) {
        clearInterval(progressUpdateInterval.current);
      }
    };
  }, []);

  // Initialize or reinitialize the player when selected video changes
  useEffect(() => {
    if (selectedVideo && window.YT && window.YT.Player) {
      if (youtubePlayerRef.current) {
        // Destroy existing player
        youtubePlayerRef.current.destroy();
      }
      initializePlayer();
    }
  }, [selectedVideo]);

  const initializePlayer = () => {
    if (!playerRef.current || !selectedVideo) return;

    const videoId = extractYoutubeId(selectedVideo.youtubeUrl);
    if (!videoId) return;

    youtubePlayerRef.current = new window.YT.Player(playerRef.current, {
      videoId: videoId,
      playerVars: {
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        playsinline: 1,
        autoplay: 0,
        origin: window.location.origin,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });
  };

  const onPlayerReady = (event) => {
    setPlayerReady(true);
    setDuration(event.target.getDuration());
    
    // Start progress update interval
    if (progressUpdateInterval.current) {
      clearInterval(progressUpdateInterval.current);
    }
    
    progressUpdateInterval.current = setInterval(() => {
      if (youtubePlayerRef.current) {
        const currentTime = youtubePlayerRef.current.getCurrentTime();
        const duration = youtubePlayerRef.current.getDuration();
        setCurrentTime(currentTime);
        setDuration(duration);
      }
    }, 1000);
  };

  const onPlayerStateChange = (event) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  const onPlayerError = (event) => {
    console.error('YouTube Player Error:', event.data);
  };

  // Toggle fullscreen for the video container only
  const handleFullScreen = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainerRef.current.requestFullscreen();
      }
    }
  };

  // Custom control handlers
  const togglePlay = () => {
    if (!youtubePlayerRef.current) return;
    
    if (isPlaying) {
      youtubePlayerRef.current.pauseVideo();
    } else {
      youtubePlayerRef.current.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!youtubePlayerRef.current) return;
    
    if (isMuted) {
      youtubePlayerRef.current.unMute();
    } else {
      youtubePlayerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleProgressBarClick = (e) => {
    if (!youtubePlayerRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTime = pos * duration;
    
    youtubePlayerRef.current.seekTo(seekTime, true);
  };

  // Handle touch events for the progress bar
  const handleProgressBarTouch = (e) => {
    if (!youtubePlayerRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX;
    const pos = (touchX - rect.left) / rect.width;
    const seekTime = pos * duration;
    
    youtubePlayerRef.current.seekTo(seekTime, true);
  };

  // Format time (seconds) to MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return <Loader />;
  if (!course)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 text-5xl mb-4">
          <Lock size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
        <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Go Back Home
        </button>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center my-10">
              {course.title}
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-center">
              {course.description}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/4">
              <div
                ref={videoContainerRef}
                className="relative video-container bg-black rounded-xl overflow-hidden shadow-lg"
                style={{ aspectRatio: '16/9', width: '100%' }}
              >
                {selectedVideo ? (
                  <>
                    {/* YouTube player div */}
                    <div 
                      id="youtube-player" 
                      ref={playerRef} 
                      className="absolute top-0 left-0 w-full h-full"
                    ></div>
                    
                    {/* Watermark */}
                    {user && (
                      <span className="watermark">{user.email}</span>
                    )}
                    
                    {/* Main video protection overlay */}
                    <div 
                      className="absolute inset-0 z-10 video-protection-overlay"
                      onClick={togglePlay}
                    />
                    
                    {/* Strategic overlays for blocking specific YouTube controls */}
                    <div className="absolute top-0 right-0 w-24 h-16 z-20 video-share-block" />
                    <div className="absolute bottom-0 right-0 w-24 h-16 z-20 video-fullscreen-block" />
                    <div className="absolute bottom-0 left-0 w-24 h-16 z-20 video-settings-block" />
                    
                    {/* Custom video controls - Always visible */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent flex items-center p-3 video-controls-container z-30">
                      <button 
                        onClick={togglePlay} 
                        className="text-white mr-4"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </button>
                      
                      <button 
                        onClick={toggleMute} 
                        className="text-white mr-4"
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      
                      <div className="flex-1 mx-4">
                        <div 
                          ref={progressBarRef} 
                          className="h-3 bg-gray-600 rounded cursor-pointer" 
                          onClick={handleProgressBarClick}
                          onTouchStart={handleProgressBarTouch}
                          onTouchMove={handleProgressBarTouch}
                        >
                          <div 
                            className="h-full bg-indigo-600 rounded" 
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-white mt-1">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleFullScreen} 
                        className="text-white"
                      >
                        <Maximize size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-800 text-white">
                    <p className="text-center text-xl font-semibold">
                      No video selected
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-4">
                <h2 className="text-sm md:text-xl font-semibold text-gray-800">
                  {selectedVideo?.title || "Select a video to play"}
                </h2>

                <button
                  onClick={handleFullScreen}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  <Maximize size={18} className="mr-2" /> Fullscreen
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/4">
              <div className="bg-gray-100 rounded-xl p-4">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Course Content
                </h2>
                {course.videos && course.videos.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2 playlist-scroll">
                    {course.videos.map((video, index) => {
                      const isSelected = selectedVideo === video;
                      const thumbnailId = extractYoutubeId(video.youtubeUrl);

                      return (
                        <div
                          key={index}
                          className={`group relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${isSelected
                              ? 'ring-2 ring-indigo-600 shadow-md'
                              : 'hover:shadow-md'
                            }`}
                          onClick={() => setSelectedVideo(video)}
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          <div className="relative">
                            <img
                              src={`https://img.youtube.com/vi/${thumbnailId}/hqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-24 object-cover"
                              draggable="false"
                              onContextMenu={(e) => e.preventDefault()}
                            />
                            <div className={`absolute inset-0 bg-black ${isSelected ? 'opacity-40' : 'opacity-0 group-hover:opacity-30'} transition-opacity duration-300`}></div>
                            <div className={`absolute inset-0 flex items-center justify-center ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
                              <div className="bg-white bg-opacity-90 rounded-full p-2">
                                <Play size={20} className="text-indigo-600" />
                              </div>
                            </div>
                            <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-tl-md">
                              {index + 1}/{course.videos.length}
                            </div>
                          </div>
                          <div className={`p-2 ${isSelected ? 'bg-indigo-50' : 'bg-white'}`}>
                            <p className="text-sm font-medium truncate">
                              {video.title}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      No videos available for this course.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .video-container:fullscreen {
          padding: 0;
          margin: 0;
          background: black;
        }
        
        .watermark {
          position: absolute;
          z-index: 50;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          padding: 5px 10px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
          pointer-events: none;
          animation: watermarkMove 40s infinite alternate;
          backdrop-filter: blur(2px);
        }
        
        @keyframes watermarkMove {
          0% { top: 5%; left: 5%; }
          25% { top: 5%; left: 85%; }
          50% { top: 85%; left: 85%; }
          75% { top: 85%; left: 5%; }
          100% { top: 5%; left: 5%; }
        }
        
        .playlist-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(107, 114, 128, 0.5) transparent;
        }
        
        .playlist-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .playlist-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .playlist-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(107, 114, 128, 0.5);
          border-radius: 3px;
        }
        
        /* Video protection styles */
        .video-protection-overlay {
          cursor: pointer;
        }
        
        .video-share-block {
          cursor: default;
          background: transparent;
        }
        
        .video-fullscreen-block {
          cursor: default;
          background: transparent;
        }
        
        .video-settings-block {
          cursor: default;
          background: transparent;
        }
        
        /* Custom control styles */
        .video-controls-container button {
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .video-controls-container button:hover {
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </>
  );
};

export default CourseDetails;