import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
  const { albumId } = useParams();
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (albumId) fetchAlbumById(albumId);
  }, [fetchAlbumById, albumId]);

  if (isLoading) return null;

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;
    const isCurrent = currentAlbum?.songs.some((s) => s._id === currentSong?._id);
    isCurrent ? togglePlay() : playAlbum(currentAlbum?.songs, 0);
  };

  const handlePlaySong = (index) => {
    if (!currentAlbum) return;
    playAlbum(currentAlbum.songs, index);
  };

  return (
    <div className='h-full'>
      <ScrollArea className='h-full rounded-md'>
        <div className='relative min-h-full'>
          <div
            className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none'
            aria-hidden='true'
          />
          <div className='relative z-10'>

            {/* Header */}
            <div className='flex flex-col sm:flex-row p-4 sm:p-6 gap-4 sm:gap-6'>
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className='w-44 h-44 sm:w-[240px] sm:h-[240px] shadow-xl rounded object-cover'
              />
              <div className='flex flex-col justify-end gap-1'>
                <p className='text-sm font-medium'>Album</p>
                <h1 className='text-2xl sm:text-5xl font-bold text-white truncate max-w-xs sm:max-w-full'>
                  {currentAlbum?.title}
                </h1>
                <div className='flex flex-wrap items-center gap-2 text-sm text-zinc-300'>
                  <span className='truncate max-w-[180px] sm:max-w-full font-medium'>{currentAlbum?.artist}</span>
                  <span>• {currentAlbum?.songs.length} songs</span>
                  <span>• {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className='px-4 sm:px-6 pb-4 flex items-center gap-6'>
              <Button
                onClick={handlePlayAlbum}
                size='icon'
                className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all'
              >
                {isPlaying && currentAlbum?.songs.some((s) => s._id === currentSong?._id) ? (
                  <Pause className='h-7 w-7 text-black' />
                ) : (
                  <Play className='h-7 w-7 text-black' />
                )}
              </Button>
            </div>

            {/* Song List */}
            <div className='bg-black/20 backdrop-blur-sm'>
              {/* Desktop column headers */}
              <div className='hidden sm:grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5'>
                <div>#</div>
                <div>Title</div>
                <div>Released Date</div>
                <div><Clock className='h-4 w-4' /></div>
              </div>

              <div className='px-4 sm:px-6'>
                <div className='space-y-2 py-4'>
                  {currentAlbum?.songs.map((song, index) => {
                    const isCurrent = currentSong?._id === song._id;
                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className='flex sm:grid sm:grid-cols-[16px_4fr_2fr_1fr] items-center gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer'
                      >
                        {/* Index or Icon */}
                        <div className='flex items-center justify-center min-w-[16px]'>
                          {isCurrent && isPlaying ? (
                            <div className='size-4 text-green-500'>♫</div>
                          ) : (
                            <span className='group-hover:hidden'>{index + 1}</span>
                          )}
                          {!isCurrent && (
                            <Play className='h-4 w-4 hidden group-hover:block' />
                          )}
                        </div>

                        {/* Song info */}
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className='size-10 flex-shrink-0 rounded object-cover'
                          />
                          <div className='truncate'>
                            <div className='font-medium text-white truncate max-w-[160px] sm:max-w-full'>{song.title}</div>
                            <div className='truncate text-zinc-400 text-xs'>{song.artist}</div>
                          </div>
                        </div>

                        {/* Hide below on mobile */}
                        <div className='hidden sm:flex items-center'>{song.createdAt.split("T")[0]}</div>
                        <div className='hidden sm:flex items-center'>{formatDuration(song.duration)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
