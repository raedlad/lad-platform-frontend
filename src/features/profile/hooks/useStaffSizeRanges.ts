import { useState, useEffect } from "react";
import { operationalApi } from "../services/operationalApi";
import { StaffSizeRange } from "../store/operationalStore";

export interface UseStaffSizeRangesReturn {
  staffSizeRanges: StaffSizeRange[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useStaffSizeRanges(): UseStaffSizeRangesReturn {
  const [staffSizeRanges, setStaffSizeRanges] = useState<StaffSizeRange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffSizeRanges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const operationalData = await operationalApi.getOperationalData();
      setStaffSizeRanges(operationalData.staff_size_ranges);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch staff size ranges";
      setError(errorMessage);
      console.error("Error fetching staff size ranges:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchStaffSizeRanges();
  };

  useEffect(() => {
    fetchStaffSizeRanges();
  }, []);

  return {
    staffSizeRanges,
    isLoading,
    error,
    refetch,
  };
}
