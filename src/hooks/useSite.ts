import { useEffect, useState } from "react";
import { DEFAULT_SITE, type SiteSettings, fetchSite } from "../api/site";

let cached: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

export function useSite() {
  const [data, setData] = useState<SiteSettings>(cached ?? DEFAULT_SITE);

  useEffect(() => {
    if (inflight) {
      inflight.then(setData).catch(() => setData(DEFAULT_SITE));
      return;
    }
    inflight = fetchSite();
    inflight
      .then((d) => {
        cached = d;
        setData(d);
      })
      .catch(() => setData(DEFAULT_SITE));
  }, []);

  return data;
}
