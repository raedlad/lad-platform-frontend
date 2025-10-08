import { useContractorOffersStore } from "../store/contractorOffersStore";

export const useAvailableProjects = () => {
  const store = useContractorOffersStore();

  return {
    availableProjects: store.availableProjects,
    isLoading: store.isLoading,
    error: store.error,
    fetchAvailableProjects: store.fetchAvailableProjects,
  };
};
