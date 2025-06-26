import { useEffect, useState } from "react";
import { getAllAnalytics } from "@/services/analytics.service";
import { th } from "zod/v4/locales";

export function useAnalytics(period = "7d") {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllAnalytics(period)
      .then(setData)
      .catch(e => {
        setError(e.message)
        throw new Error(`Erreur lors du chargement des données d'analyse : ${e.message}`);
      })
      .finally(() => setLoading(false));
  }, [period]);

  return { data, loading, error };
}