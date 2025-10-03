import { useState, useEffect } from "react";
import Top100SongsComponent from "../components/Top100SongsComponent";
import { fetchHistory } from "../utils/fetchHistory";

export default function Top100SongsPage() {
  const [activeFilter, setActiveFilter] = useState("alltime");
  const [topSongs, setTopSongs] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function processHistory() {
      setIsLoading(true);
      try {
        const dadosHistory = await fetchHistory({ signal: controller.signal });

        if (!mounted || controller.signal.aborted) return;

        let mostRecentDate = 0;
        for (let i = 0; i < dadosHistory.length; i++) {
          const entryTime = new Date(dadosHistory[i].ts).getTime();
          if (!isNaN(entryTime) && entryTime > mostRecentDate) mostRecentDate = entryTime;
        }
        const referenceDate = mostRecentDate || Date.now();

        let startTimestamp;
        switch (activeFilter) {
          case "month":
            startTimestamp = referenceDate - 30 * 24 * 60 * 60 * 1000;
            break;
          case "6months":
            startTimestamp = referenceDate - 6 * 30 * 24 * 60 * 60 * 1000;
            break;
          case "1year":
            startTimestamp = referenceDate - 365 * 24 * 60 * 60 * 1000;
            break;
          case "alltime":
          default:
            startTimestamp = 0;
            break;
        }

        const songCounts = {};
        let minDate = Infinity;
        let maxDate = -Infinity;

        for (let i = 0; i < dadosHistory.length; i++) {
          const entry = dadosHistory[i];
          const entryTime = new Date(entry.ts).getTime();
          if (isNaN(entryTime) || entryTime < startTimestamp) continue;

          if (entryTime < minDate) minDate = entryTime;
          if (entryTime > maxDate) maxDate = entryTime;

          const track = entry.master_metadata_track_name;
          const artist = entry.master_metadata_album_artist_name;

          if (track && artist) {
            const key = `${artist} - ${track}`;
            if (!songCounts[key]) songCounts[key] = { song: key, count: 0, ms: 0, artist };
            songCounts[key].count += 1;
            songCounts[key].ms += entry.ms_played || 0;
          }
        }

        const songsArray = Object.values(songCounts);
        songsArray.sort((a, b) => b.count - a.count);
        const top100 = songsArray.slice(0, 100);

        if (!mounted) return;
        setTopSongs(top100);
        if (minDate !== Infinity && maxDate !== -Infinity) {
          setDateRange({ start: new Date(minDate), end: new Date(maxDate) });
        } else {
          setDateRange({ start: null, end: null });
        }
      } catch (error) {
        // ignora abort
        if (error.name === "AbortError") return;
        console.error("Erro ao processar histórico (songs):", error);
        if (mounted) {
          setTopSongs([]);
          setDateRange({ start: null, end: null });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    processHistory();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [activeFilter]);

  return (
    <Top100SongsComponent
      topSongs={topSongs}
      isLoading={isLoading}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
      dateRange={dateRange}
    />
  );
}