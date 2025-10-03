import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, SquarePen } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { fetchHistory } from "../utils/fetchHistory";

export default function MainPage() {
  const [topArtists, setTopArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const json = await fetchHistory({ signal: controller.signal });
        if (!mounted || controller.signal.aborted) return;

        const artistCounts = {};
        json.forEach((item) => {
          const name =
            item.master_metadata_album_artist_name ||
            item.artistName ||
            item.master_metadata_track_artist_name ||
            null;
          if (!name) return;
          artistCounts[name] = (artistCounts[name] || 0) + 1;
        });

        const top = Object.entries(artistCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
          .map((a, i) => ({ id: i + 1, ...a }));

        if (!mounted) return;
        setTopArtists(top);
      } catch (err) {
        if (err && err.name === "AbortError") {
          console.debug("HomePage fetch aborted");
          return;
        }
        console.error("Erro ao carregar history.json em HomePage:", err);
        if (mounted) setError(err.message || "Erro ao carregar dados");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const fmt = (n) => n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";

  const imageFor = (name) => {
    const map = {
      Eminem: "/eminem.jpg",
      "Kendrick Lamar": "/kendrick.jpg",
      TOOL: "/tool.jpg",
      "System Of A Down": "/System.jpg",
      "J. Cole": "/jcole.jpg",
      "Earl Sweatshirt": "/earl.jpg",
      BROCKHAMPTON: "/brock.jpg",
      "Vince Staples": "/vince.jpg",
      "Kanye West": "/kanye.jpeg",
      "Slow J": "/slowj.jpg",
    };
    return map[name] || "/default.png";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando top artists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md pb-24">
        <SearchBar />

        {/* Top Artists */}
        <div className="px-4 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold whitespace-nowrap">
              Top Artist of All Time
            </h2>
            <div className="h-px flex-1 bg-gray-700"></div>
          </div>

          <div className="flex gap-4 pb-2 overflow-x-auto custom-scrollbar">
            {topArtists.map((artist) => (
              <Link
                key={artist.id}
                href={`/artist/${encodeURIComponent(artist.name)}`}
                className="flex flex-col items-center flex-shrink-0"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-1">
                  <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={imageFor(artist.name)}
                      alt={artist.name}
                      fill
                      className="rounded-b-3xl object-cover"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-center max-w-[5.5rem] truncate">
                  {artist.name}
                </p>
                <p className="text-xs text-gray-400">
                  {fmt(artist.count)} plays
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Wrapped Card */}
        <div className="px-4 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold whitespace-nowrap">
              Discover your 2025 Wrapped
            </h2>
            <div className="h-px flex-1 bg-gray-700"></div>
          </div>

          <Link href="/wrapped" className="block">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500 via-orange-500 to-red-600 p-8 transition-all duration-300">
              {/* card: normal cursor */}
              <div className="absolute top-6 left-6 w-24 h-24 bg-pink-600/60 rounded-2xl transform -rotate-12"></div>
              <div className="absolute bottom-6 right-6 w-40 h-40 border-8 border-red-400/40 rounded-3xl transform rotate-45"></div>

              <div className="relative z-10 text-center py-12">
                <h3 className="text-4xl font-bold mb-3">Your 2025 Wrapped</h3>
                <p className="text-white/90 mb-8 text-lg">
                  Jump into your year in audio.
                </p>
                <div className="flex justify-center">
                  <button className="bg-blue-400 hover:bg-blue-500 text-black font-bold px-10 py-3 rounded-full transition-colors button-laser cursor-grab">
                    Let&apos;s go
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Green Button */}
        <div className="px-4 mt-4 mb-20">
          <Link href="/top100SongsPage">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors button-laser">
              See the most played songs
            </button>
          </Link>
        </div>
      </div>

      {/* Scoped laser CSS for buttons only */}
      <style jsx>{`
        .button-laser {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          z-index: 0;
        }

        .button-laser::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            120deg,
            rgba(255, 0, 255, 0.2),
            rgba(0, 255, 255, 0.2),
            rgba(255, 255, 0, 0.2),
            rgba(255, 0, 255, 0.2)
          );
          transform: rotate(45deg) translateX(-100%);
          transition: transform 0.6s ease;
          pointer-events: none;
          z-index: 1;
          filter: blur(6px);
        }

        .button-laser:hover::before {
          transform: rotate(45deg) translateX(100%);
        }

        .button-laser:hover {
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.6),
                      0 0 30px rgba(255, 0, 255, 0.4),
                      0 0 50px rgba(0, 255, 0, 0.2);
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
