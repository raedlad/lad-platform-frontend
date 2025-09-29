import { useState, useEffect } from "react";
import {
  engineeringTypesApi,
  EngineeringType,
} from "../services/engineeringTypesApi";

export interface UseEngineeringTypesReturn {
  engineeringTypes: EngineeringType[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEngineeringTypes(): UseEngineeringTypesReturn {
  const [engineeringTypes, setEngineeringTypes] = useState<EngineeringType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEngineeringTypes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const types = await engineeringTypesApi.getEngineeringTypes();
      setEngineeringTypes(types);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch engineering types";
      setError(errorMessage);
      console.error("Error fetching engineering types:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchEngineeringTypes();
  };

  useEffect(() => {
    fetchEngineeringTypes();
  }, []);

  return {
    engineeringTypes,
    isLoading,
    error,
    refetch,
  };
}
