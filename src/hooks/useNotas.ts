import { useEffect, useState } from "react";
import { type NotasPayload, fetchNotas } from "../api/notas";

let cached: NotasPayload | null = null;
let inflight: Promise<NotasPayload> | null = null;

export function useNotas() {
  const [data, setData] = useState<NotasPayload | null>(cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (inflight) {
      inflight.then(setData).catch((e) => setError(String(e)));
      return;
    }
    inflight = fetchNotas();
    inflight
      .then((d) => {
        cached = d;
        setData(d);
      })
      .catch((e) => setError(String(e)));
  }, []);

  return { data, error };
}
