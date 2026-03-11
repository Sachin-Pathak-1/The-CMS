import { useEffect, useState } from "react";
import { apiRequest } from "../lib/apiClient";

export function useBackendList(type, initialValue = []) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await apiRequest(`/public/lists/${type}`);
        if (!active) return;
        setData(Array.isArray(response?.data) ? response.data : []);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load data");
        setData([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [type]);

  return { data, setData, loading, error };
}
