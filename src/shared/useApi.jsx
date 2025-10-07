import React from "react";

export function useApi(url, { deps = [] } = {}) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const controllerRef = React.useRef(null);

  const load = React.useCallback(async () => {
    controllerRef.current?.abort();
    const ac = new AbortController();
    controllerRef.current = ac;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, { signal: ac.signal, credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      if (e.name !== "AbortError") setError(e);
    } finally {
      setLoading(false);
    }
  }, [url]);

  React.useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.length ? [load, ...deps] : [load]);

  return { data, loading, error, reload: load };
}
