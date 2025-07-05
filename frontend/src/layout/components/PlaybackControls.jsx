import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import {
  Laptop2,
  ListMusic,
  Mic2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = document.querySelector("audio");
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      usePlayerStore.getState().playNext();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    audio.volume = volume / 100;

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong]);

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .scrolling-text {
            animation: scrollText 10s linear infinite;
            white-space: nowrap;
            display: inline-block;
          }
          @keyframes scrollText {
            0% { transform: translateX(0%); }
            50% { transform: translateX(-50%); }
            100% { transform: translateX(0%); }
          }
        }
      `}</style>

      <footer className="relative h-24 bg-zinc-900 border-t border-zinc-800 px-4">
        {/* Mobile Top Progress Bar */}
        <div className="sm:hidden absolute top-0 left-0 right-0 px-4 pt-[6px] z-20">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            defaultValue={[0]}
            onValueChange={handleSeek}
            className="w-full"
            thumbClass="h-[10px] w-[10px] bg-green-500 border-none shadow-sm rounded-full"
            trackClass="bg-green-500 h-[4px] rounded-full"
          />
        </div>

        <div className="flex justify-between items-center h-full max-w-[1800px] mx-auto">
          {/* Song Info */}
          <div className="flex items-center gap-4 w-[40%] sm:w-[30%] min-w-0">
            {currentSong && (
              <>
                <img
                  src={currentSong.imageUrl}
                  alt={currentSong.title}
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex flex-col min-w-0 overflow-hidden">
                  <span className="text-sm font-medium text-white truncate sm:truncate">
                    <span className="scrolling-text sm:animate-none">{currentSong.title}</span>
                  </span>
                  <span className="text-xs text-zinc-400 truncate sm:animate-none">
                    <span className="scrolling-text sm:animate-none">{currentSong.artist}</span>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Playback Buttons */}
          <div className="flex flex-col items-center gap-1 w-[30%] sm:w-[40%]">
            <div className="flex items-center gap-3 sm:gap-5">
              <Button
                size="icon"
                variant="ghost"
                className="hidden sm:inline-flex text-zinc-400 hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-zinc-400 hover:text-white"
                onClick={playPrevious}
                disabled={!currentSong}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                className="bg-white hover:bg-white/80 text-black rounded-full h-9 w-9"
                onClick={togglePlay}
                disabled={!currentSong}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-zinc-400 hover:text-white"
                onClick={playNext}
                disabled={!currentSong}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="hidden sm:inline-flex text-zinc-400 hover:text-white"
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Desktop Progress */}
            <div className="hidden sm:flex items-center gap-2 w-full">
              <div className="text-xs text-zinc-400">{formatTime(currentTime)}</div>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="w-full hover:cursor-grab active:cursor-grabbing"
              />
              <div className="text-xs text-zinc-400">{formatTime(duration)}</div>
            </div>
          </div>

          {/* Volume / Device controls */}
          <div className="hidden sm:flex items-center gap-4 w-[30%] justify-end">
            <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
              <Mic2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
              <ListMusic className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
              <Laptop2 className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white">
                <Volume1 className="h-4 w-4" />
              </Button>

              <Slider
                value={[volume]}
                max={100}
                step={1}
                className="w-24"
                onValueChange={(value) => {
                  setVolume(value[0]);
                  if (audioRef.current) {
                    audioRef.current.volume = value[0] / 100;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
