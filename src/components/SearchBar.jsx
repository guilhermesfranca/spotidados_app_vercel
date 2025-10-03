
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { fetchHistory } from "../utils/fetchHistory";

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Cargar artistas únicos del history.json
  useEffect(() => {
    async function loadArtists() {
      try {
        const history = await fetchHistory();
        // Extraer artistas únicos
        const uniqueArtists = [...new Set(
          history
            .map(item => item.master_metadata_album_artist_name)
            .filter(artist => artist && artist.trim() !== "")
        )].sort();

        setArtists(uniqueArtists);
      } catch (error) {
        console.error("Error al cargar artistas:", error);
      }
    }

    loadArtists();
  }, []);

  // Filtrar artistas basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredArtists([]);
      setShowResults(false);
      return;
    }

    const filtered = artists.filter(artist =>
      artist.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Limitar a 10 resultados

    setFilteredArtists(filtered);
    setShowResults(filtered.length > 0);
  }, [searchTerm, artists]);

  const handleArtistClick = (artist) => {
    setSearchTerm(artist);
    setShowResults(false);

    // Codificar el nombre del artista para URL (espacios -> %20)
    const encodedArtist = encodeURIComponent(artist);

    // Navegar al perfil del artista
    router.push(`/artist/${encodedArtist}`);
  };

  return (
    <div className="relative px-4 py-4">
      <div className="flex items-center gap-3">
        {/* Foto de perfil */}
        <Link href="/perfil">
          <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden flex-shrink-0 relative">
            <Image src="/profile_pic.png" alt="Profile" fill className="object-cover" />
          </div>
        </Link>

        {/* Barra de búsqueda */}
        <div className="flex-1 relative">
          <div className="flex items-center gap-2 bg-[#0f0f0f]/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-800 shadow">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for artist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setShowResults(true)}
              className="bg-transparent outline-none flex-1 text-white placeholder-gray-400"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowResults(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Resultados de búsqueda */}
          {showResults && filteredArtists.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f0f0f]/95 backdrop-blur-sm border border-gray-800 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
              {filteredArtists.map((artist, index) => (
                <button
                  key={index}
                  onClick={() => handleArtistClick(artist)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors border-b border-gray-800/50 last:border-b-0 text-white"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{artist}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}