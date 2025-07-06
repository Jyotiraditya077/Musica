import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { Link } from "react-router-dom";

const Library = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Your Playlists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          albums.map((album) => (
            <Link
              to={`/albums/${album._id}`}
              key={album._id}
              className="bg-zinc-800 p-3 rounded-md hover:bg-zinc-700 transition"
            >
              <img
                src={album.imageUrl}
                alt={album.title}
                className="rounded-md object-cover w-full h-40 mb-2"
              />
              <h3 className="text-sm font-semibold truncate">{album.title}</h3>
              <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Library;
