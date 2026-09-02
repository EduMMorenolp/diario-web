import { useEffect, useState } from "react";
import { type NotasPayload, fetchNotas } from "../api/notas";

let cached: NotasPayload | null = null;
let inflight: Promise<NotasPayload> | null = null;

export function useNotas() {
  const [data, setData] = useState<NotasPayload | null>(cached);

  useEffect(() => {
    if (inflight) {
      inflight.then(setData);
      return;
    }
    inflight = fetchNotas();
    inflight.then((d) => {
      cached = d;
      setData(d);
    });
  }, []);

  return { data };
}
