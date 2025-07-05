import { useEffect, useState } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Input } from "@/components/ui/input";
import { MusicIcon } from "lucide-react";

const SearchPage = () => {
  const { songs, fetchSongs, isLoading } = useMusicStore();
  const { playSingleSong } = usePlayerStore();
  const [query, setQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    if (!query) {
      setFilteredSongs([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = songs.filter(
      (song) =>
        song.title.toLowerCase().includes(lowerQuery) ||
        song.artist.toLowerCase().includes(lowerQuery)
    );
    setFilteredSongs(filtered);
  }, [query, songs]);

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4 text-white'>Search Songs</h2>

      <Input
        type='text'
        placeholder='Type a song or artist name...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='mb-6 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400'
      />

      {isLoading ? (
        <p className='text-zinc-400'>Loading songs...</p>
      ) : query.length === 0 ? (
        <div className='flex flex-col items-center mt-20 space-y-4'>
          <img src='/Musica.png' alt='Musica Logo' className='w-32 h-32 opacity-70' />
          <p className='text-white text-lg font-medium opacity-80'>
            Hey, what do you want to listen to today?
          </p>
        </div>
      ) : filteredSongs.length === 0 ? (
        <p className='text-zinc-400'>Adding soon...</p>
      ) : (
        <div className='max-h-[60vh] overflow-y-auto pr-2 space-y-4 scrollbar-hide'>
          {filteredSongs.map((song) => (
            <div
              key={song._id}
              onClick={() => playSingleSong(song)}
              className='flex items-center gap-4 hover:bg-zinc-800 p-3 rounded-md transition cursor-pointer'
            >
              <img
                src={song.imageUrl}
                alt={song.title}
                className='w-12 h-12 rounded-md object-cover'
              />
              <div>
                <p className='text-white font-medium'>{song.title}</p>
                <p className='text-zinc-400 text-sm'>{song.artist}</p>
              </div>
              <MusicIcon className='ml-auto text-zinc-400' />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
