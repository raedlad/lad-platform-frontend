import { useState, useEffect } from "react";
import { workFieldsApi } from "../services/workFieldsApi";

export interface WorkField {
  id: number;
  name: string;
  name_en: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UseWorkFieldsReturn {
  workFields: WorkField[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWorkFields(): UseWorkFieldsReturn {
  const [workFields, setWorkFields] = useState<WorkField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkFields = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await workFieldsApi.getWorkFields();
      setWorkFields(response.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch work fields";
      setError(errorMessage);
      console.error("Error fetching work fields:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchWorkFields();
  };

  useEffect(() => {
    fetchWorkFields();
  }, []);

  return {
    workFields,
    isLoading,
    error,
    refetch,
  };
}
