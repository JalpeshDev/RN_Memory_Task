import { useCallback, useEffect, useMemo, useState } from "react";
import supabase from "../services/supabaseClient";
import { StoredMemory } from "app/types/memory";

const useFetchMemories = () => {
  const [data, setData] = useState<StoredMemory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMemories = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setData(data as StoredMemory[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  return useMemo(
    () => ({
      data,
      loading,
      refetch: fetchMemories,
    }),
    [data, loading, fetchMemories]
  );
};

export default useFetchMemories;
