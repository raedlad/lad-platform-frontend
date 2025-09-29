import { useState, useEffect } from "react";
import { operationalApi } from "../services/operationalApi";
import { AnnualProjectsRange } from "../store/operationalStore";

export interface UseAnnualProjectsRangesReturn {
  annualProjectsRanges: AnnualProjectsRange[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAnnualProjectsRanges(): UseAnnualProjectsRangesReturn {
  const [annualProjectsRanges, setAnnualProjectsRanges] = useState<
    AnnualProjectsRange[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnualProjectsRanges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const operationalData = await operationalApi.getOperationalData();
      setAnnualProjectsRanges(operationalData.annual_projects_ranges);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch annual projects ranges";
      setError(errorMessage);
      console.error("Error fetching annual projects ranges:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchAnnualProjectsRanges();
  };

  useEffect(() => {
    fetchAnnualProjectsRanges();
  }, []);

  return {
    annualProjectsRanges,
    isLoading,
    error,
    refetch,
  };
}
