import { useEffect, useState } from "react";
import { getAllAnalytics } from "@/services/analytics.service";

export function useAnalytics(period = "7d") {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllAnalytics(period)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [period]);

  return { data, loading, error };
}