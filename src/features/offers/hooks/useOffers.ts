import { useOffersStore } from "../store/offersStore";
import { useEffect } from "react";

export const useOffers = () => {
  const store = useOffersStore();

  // Auto-fetch offers when component mounts
  useEffect(() => {
    store.fetchOffers();
  }, []);

  return store;
};
