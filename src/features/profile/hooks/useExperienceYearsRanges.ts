import { useState, useEffect } from "react";
import {
  experienceYearsRangesApi,
  ExperienceYearsRange,
} from "../services/experienceYearsRangesApi";

export interface UseExperienceYearsRangesReturn {
  experienceYearsRanges: ExperienceYearsRange[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useExperienceYearsRanges(): UseExperienceYearsRangesReturn {
  const [experienceYearsRanges, setExperienceYearsRanges] = useState<
    ExperienceYearsRange[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperienceYearsRanges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const ranges = await experienceYearsRangesApi.getExperienceYearsRanges();
      setExperienceYearsRanges(ranges);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch experience years ranges";
      setError(errorMessage);
      console.error("Error fetching experience years ranges:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchExperienceYearsRanges();
  };

  useEffect(() => {
    fetchExperienceYearsRanges();
  }, []);

  return {
    experienceYearsRanges,
    isLoading,
    error,
    refetch,
  };
}
