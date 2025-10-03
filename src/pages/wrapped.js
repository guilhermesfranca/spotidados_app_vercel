import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { fetchHistory } from "../utils/fetchHistory";
import {
  totalMusicasTocadas,
  totalMusicasDiferentes,
  totalMinutosOuvidos,
  mediaDiariaOuvida,
  estacaoMaisOuvida,
  horaMaisOuvida,
  encontrarArtistaMaisOuvido,
  obterPrimeiraMusica,
} from "../utils/dataProcessing";

// Componente para cada estadística en cuadrado
function StatCard({ title, value, isHighlight }) {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col justify-center text-left shadow-lg">
      <span className="text-xs text-gray-400 mb-2">{title}</span>
      <span className={`text-3xl font-bold ${isHighlight ? "text-green-500" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}

export default function EstatisticasPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        const dadosHistory = await fetchHistory({ signal: controller.signal });
        if (!mounted || controller.signal.aborted) return;

        const totalPlays = totalMusicasTocadas(dadosHistory);
        const uniqueTracks = totalMusicasDiferentes(dadosHistory);
        const totalMs = dadosHistory.reduce((s, d) => s + (Number(d.ms_played) || 0), 0);
        const totalMinutes = Math.floor(totalMs / 60000);
        const dailyAverage = mediaDiariaOuvida(dadosHistory);
        const favoriteSeason = estacaoMaisOuvida(dadosHistory);
        const hours = {};
        dadosHistory.forEach((d) => {
          const t = new Date(d.ts);
          if (isNaN(t.getTime())) return;
          const h = t.getHours();
          hours[h] = (hours[h] || 0) + 1;
        });
        const preferredHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
        const preferredTimeLabel = preferredHour !== null ? `${preferredHour}:00` : "N/A";
        const mostListenedArtist = encontrarArtistaMaisOuvido(dadosHistory);
        const sortedByTs = dadosHistory
          .map((d) => ({ ...d, _ts: new Date(d.ts).getTime() }))
          .filter((d) => !isNaN(d._ts))
          .sort((a, b) => a._ts - b._ts);
        const firstMusic = sortedByTs[0]?.master_metadata_track_name || "N/A";

        if (!mounted) return;
        setStats({
          totalPlays,
          uniqueTracks,
          totalMinutes,
          dailyAverage,
          favoriteSeason,
          preferredTimeLabel,
          mostListenedArtist,
          firstMusic,
        });
      } catch (e) {
        if (e && e.name === "AbortError") {
          console.debug("wrapped fetch aborted");
          return;
        }
        console.error("Erro ao carregar stats em wrapped:", e);
        if (mounted) setStats(null);
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

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-md pb-24">
        {/* SearchBar Component */}
        <SearchBar />

        {/* Estadísticas en cuadrados */}
        <div className="grid grid-cols-2 gap-4 mt-6 px-4">
          <StatCard title="Played Music" value={isLoading ? "..." : stats?.totalPlays ?? "0"} />
          <StatCard title="Different Music" value={isLoading ? "..." : stats?.uniqueTracks ?? "0"} />
          <StatCard title="Minutes Listened" value={isLoading ? "..." : stats?.totalMinutes ?? "0"} />
          <StatCard title="Daily Average" value={isLoading ? "..." : `${stats?.dailyAverage ?? 0} min`} />
          <StatCard title="Favorite Season" value={isLoading ? "..." : stats?.favoriteSeason ?? "N/A"} isHighlight />
          <StatCard title="Preferred Time" value={isLoading ? "..." : stats?.preferredTimeLabel ?? "N/A"} />
          <StatCard title="Most Listened Artist" value={isLoading ? "..." : stats?.mostListenedArtist ?? "N/A"} />
          <StatCard title="First Music Played" value={isLoading ? "..." : stats?.firstMusic ?? "N/A"} />
        </div>

        {/* Botones Top 100 */}
        <div className="mt-12 flex flex-col gap-6 px-4">
          <Link href="/top100ArtistsPage">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors relative overflow-hidden button-laser">
              <span>Top 100 Artists</span>
            </button>
          </Link>
          <Link href="/top100SongsPage">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-colors relative overflow-hidden button-laser">
              <span>Top 100 Songs</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Scoped CSS for buttons */}
      <style jsx>{`
        .button-laser {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          z-index: 0;
        }

        .button-laser span {
          position: relative;
          z-index: 10;
          display: block;
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