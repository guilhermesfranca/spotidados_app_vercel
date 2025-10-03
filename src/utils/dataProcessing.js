// removed static import of history.json — functions now recebem `history` como parâmetro

export function contarTotalMusicas(history = []) {
  if (!history || history.length === 0) return 0;
  return history.length;
}

export function obterPrimeiraMusica(history = []) {
  if (!history || history.length === 0) return "Nenhuma música encontrada";
  return history[0]?.master_metadata_track_name || "Música desconhecida";
}

export function encontrarArtistaMaisOuvido(history = []) {
  if (!history || history.length === 0) return "Nenhum artista encontrado";
  const contagemArtistas = {};
  history.forEach((musica) => {
    const artista = musica.master_metadata_album_artist_name;
    if (artista) contagemArtistas[artista] = (contagemArtistas[artista] || 0) + 1;
  });
  let artistaMaisOuvido = "Nenhum artista encontrado";
  let maiorContagem = 0;
  for (const artista in contagemArtistas) {
    if (contagemArtistas[artista] > maiorContagem) {
      maiorContagem = contagemArtistas[artista];
      artistaMaisOuvido = artista;
    }
  }
  return artistaMaisOuvido;
}

export function encontrarTop100Artistas(history = []) {
  if (!history || history.length === 0) return ["Nenhum artista encontrado"];
  const contagemArtistas = {};
  history.forEach((musica) => {
    const artista = musica.master_metadata_album_artist_name;
    if (artista) contagemArtistas[artista] = (contagemArtistas[artista] || 0) + 1;
  });
  const listaOrdenada = Object.entries(contagemArtistas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);
  return listaOrdenada.map(([artista]) => artista);
}

export function encontrarTop100Musicas(history = []) {
  if (!history || history.length === 0) return ["Nenhuma música encontrada"];
  const contagemMusicas = {};
  history.forEach((musica) => {
    const track = musica.master_metadata_track_name;
    if (track) contagemMusicas[track] = (contagemMusicas[track] || 0) + 1;
  });
  const listaOrdenada = Object.entries(contagemMusicas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100);
  return listaOrdenada.map(([track]) => track);
}

export function totalMusicasTocadas(history = []) {
  if (!history) return 0;
  return history.length;
}

export function totalMusicasDiferentes(history = []) {
  if (!history) return 0;
  const musicasUnicas = new Set(
    history.map((m) => m.master_metadata_track_name).filter(Boolean)
  );
  return musicasUnicas.size;
}

export function totalMinutosOuvidos(history = []) {
  if (!history) return 0;
  const msTotais = history.reduce((acc, m) => acc + (Number(m.ms_played) || 0), 0);
  return Math.floor(msTotais / 60000);
}

export function mediaDiariaOuvida(history = []) {
  if (!history || history.length === 0) return 0;
  const dias = new Set(
    history
      .map((m) => {
        const d = new Date(m.ts);
        return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
      })
      .filter(Boolean)
  );
  const totalMinutos = totalMinutosOuvidos(history);
  return dias.size > 0 ? (totalMinutos / dias.size).toFixed(1) : 0;
}

export function horaMaisOuvida(history = []) {
  if (!history || history.length === 0) return "N/A";
  const contagemHoras = {};
  history.forEach((m) => {
    const d = new Date(m.ts);
    if (isNaN(d.getTime())) return;
    const hora = d.getHours();
    contagemHoras[hora] = (contagemHoras[hora] || 0) + 1;
  });
  const horaMax = Object.entries(contagemHoras).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    [0, 0]
  )[0];
  return `${horaMax}:00`;
}

export function estacaoMaisOuvida(history = []) {
  if (!history || history.length === 0) return "N/A";
  const contagemEstacoes = { Winter: 0, Spring: 0, Summer: 0, Autumn: 0 };
  history.forEach((m) => {
    const d = new Date(m.ts);
    if (isNaN(d.getTime())) return;
    const mes = d.getMonth();
    if ([11, 0, 1].includes(mes)) contagemEstacoes.Winter += 1;
    else if ([2, 3, 4].includes(mes)) contagemEstacoes.Spring += 1;
    else if ([5, 6, 7].includes(mes)) contagemEstacoes.Summer += 1;
    else contagemEstacoes.Autumn += 1;
  });
  return Object.entries(contagemEstacoes).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

export function filterHistoryByPeriod(history = [], period = "alltime") {
  const now = Date.now();
  let start;
  switch (period) {
    case "month":
      start = new Date();
      start.setMonth(start.getMonth() - 1);
      break;
    case "6months":
      start = new Date();
      start.setMonth(start.getMonth() - 6);
      break;
    case "1year":
      start = new Date();
      start.setFullYear(start.getFullYear() - 1);
      break;
    case "alltime":
    default:
      start = new Date(0);
      break;
  }
  const startTs = start.getTime();
  return history.filter((item) => {
    const t = new Date(item.ts).getTime();
    return !Number.isNaN(t) && t >= startTs;
  });
}

export function topSongsFromHistory(history = [], opts = {}) {
  const { limit = 100, by = "ms" } = opts;
  const map = {};
  history.forEach((entry) => {
    const track = entry.master_metadata_track_name;
    const artist = entry.master_metadata_album_artist_name;
    if (!track || !artist) return;
    const key = `${artist} - ${track}`;
    if (!map[key]) map[key] = { song: key, count: 0, ms: 0, artist };
    map[key].count += 1;
    map[key].ms += Number(entry.ms_played) || 0;
  });
  const arr = Object.values(map);
  if (by === "ms") arr.sort((a, b) => b.ms - a.ms);
  else arr.sort((a, b) => b.count - a.count);
  return arr.slice(0, limit);
}
