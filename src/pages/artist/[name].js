import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ArtistCard from "@/components/ArtistCard";
import BottomNav from "@/components/BottomNav";
import { fetchHistory } from "@/utils/fetchHistory";
import Image from "next/image";

export default function ArtistPage() {
  const router = useRouter();
  const { name } = router.query;

  // Inicializa como null para não renderizar artista errado
  const [artistName, setArtistName] = useState(null);
  const [totalPlays, setTotalPlays] = useState(0);

  // Atualiza artistName quando router e query estiverem prontos
  useEffect(() => {
    if (!router.isReady) return;
    setArtistName(name ? decodeURIComponent(name) : null);
  }, [router.isReady, name]);

  // Carrega total plays do histórico
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        const json = await fetchHistory({ signal: controller.signal });
        if (!mounted || controller.signal.aborted) return;
        setTotalPlays(Array.isArray(json) ? json.length : 0);
      } catch (e) {
        if (e && e.name === "AbortError") return;
        console.error("Erro ao carregar history.json:", e);
        if (mounted) setTotalPlays(0);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  // Não renderiza nada até artistName estar definido
  if (!artistName) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center pb-24">
      <div className="relative w-full max-w-md h-72 overflow-hidden rounded-b-3xl">
        <Image
          src={
            artistName === "Eminem"
              ? "/eminem.jpg"
              : artistName === "Kendrick Lamar"
              ? "/kendrick.jpg"
              : artistName === "TOOL"
              ? "/tool.jpg"
              : artistName === "System Of A Down"
              ? "/System.jpg"
              : artistName === "J. Cole"
              ? "/jcole.jpg"
              : artistName === "Earl Sweatshirt"
              ? "/earl.jpg"
              : artistName === "BROCKHAMPTON"
              ? "/brock.jpg"
              : artistName === "Vince Staples"
              ? "/vince.jpg"
              : artistName === "Kanye West"
              ? "/kanye.jpeg"
              : artistName === "Slow J"
              ? "/slowj.jpg"
              : "/default.png"
          }
          alt={artistName}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-white text-4xl font-bold tracking-tight">
            {artistName.toUpperCase()}
          </h1>
        </div>
      </div>

      <ArtistCard artistName={artistName} totalPlays={totalPlays} />

      <BottomNav />
    </div>
  );
}
