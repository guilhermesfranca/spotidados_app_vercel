export async function fetchHistory({ signal } = {}) {
  const paths = ["/data/history.json", "/history.json"];
  let lastErr = null;

  for (const p of paths) {
    let attempt = 0;
    while (attempt < 2) {
      attempt += 1;
      try {
        // if signal already aborted, bail out
        if (signal && signal.aborted) {
          const abortErr = new Error("Fetch aborted before start");
          abortErr.name = "AbortError";
          throw abortErr;
        }

        const res = await fetch(p, { signal });
        if (!res.ok) {
          lastErr = new Error(`HTTP ${res.status} ao carregar ${p}`);
          break; // try next path
        }
        return await res.json();
      } catch (err) {
        // rethrow genuine Abort so caller can ignore it
        if (err.name === "AbortError") {
          console.debug(`[fetchHistory] abort on ${p} attempt ${attempt}`);
          // retry once only when signal wasn't externally aborted (helps dev StrictMode double-run)
          if (attempt < 2 && !(signal && signal.aborted)) {
            await new Promise((r) => setTimeout(r, 120)); // pequeno debounce antes do retry
            continue;
          }
          throw err;
        }
        lastErr = err;
        break;
      }
    }
  }

  throw lastErr || new Error("Não foi possível carregar history.json");
}