import { useEffect, useState } from "react";
import { fetchMealInfo } from "../api/neisApi";

export function useMealInfo(date) {
  const [mealData, setMealData] = useState({ 조식: [], 중식: [], 석식: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    fetchMealInfo(date)
      .then((data) => {
        if (!cancelled) {
          setMealData(data);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date]);

  return { mealData, loading, error };
}
