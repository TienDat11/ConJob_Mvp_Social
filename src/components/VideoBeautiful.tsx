import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, BrainCog } from "lucide-react";

interface VideoBeautifulProps {
  src: string;
}

const VideoBeautiful: React.FC<VideoBeautifulProps> = ({ src }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("waiting", () => setIsLoading(true));
      video.addEventListener("canplay", () => setIsLoading(false));
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) {
        video.play().then(r => {
          console.log("Video play",r);
          setIsPlaying(true);
        });
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setVolume(value);
      if (videoRef.current) {
        videoRef.current.volume = value;
      }
      setIsMuted(value === 0);
    }
    ,[volume]
  )

  const toggleMute = () => {
    if (isMuted) {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }
      setIsMuted(false);
    } else {
      if (videoRef.current) {
        videoRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  };

  const handleProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) * (videoRef.current?.duration ?? 0)) / 100;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (playerRef.current?.requestFullscreen) {
        playerRef.current.requestFullscreen().then(r => {
          console.log(r);
          setIsFullscreen(true);
        });
      }
    } else if (document.exitFullscreen !== null) {
      document.exitFullscreen().then(r => {
        console.log(r);
        setIsFullscreen(false);
      });
    }
  }, [isFullscreen]);

  const handlePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "KeyF") {
        toggleFullscreen();
      }
    };

    const handleFullScreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [toggleFullscreen]);

  return (
    <div
      ref={playerRef}
      className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-xl"
      role="region"
      aria-label="Video Player"
    >
      <video
        ref={videoRef}
        className="w-full h-auto"
        preload="metadata"
        onClick={togglePlay}
        aria-label="Video content"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex flex-col gap-2">
          <input
            type="range"
            value={progress}
            onChange={handleProgress}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #fff ${progress}%, #4b5563 ${progress}%)`,
            }}
            aria-label="Video progress"
          />

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white rounded-lg appearance-none cursor-pointer"
                  aria-label="Volume control"
                />
              </div>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Settings"
                >
                  <BrainCog className="w-5 h-5" />
                </button>

                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 min-w-[120px]">
                    <div className="text-sm font-medium mb-1">Playback Speed</div>
                    {[0.5, 1, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handlePlaybackSpeed(speed)}
                        className={`block w-full text-left px-3 py-1 rounded ${
                          playbackSpeed === speed ? "bg-white/20" : "hover:bg-white/10"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize /> : <Maximize />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoBeautiful;
