import { useEffect } from "react";
import { globalApi } from "../services/globalApi";
import { useGlobalStore } from "../store/globalStore";

export const useGetCountries = () => {
  const { countries, setCountries } = useGlobalStore();
  useEffect(() => {
    const fetchCountries = async () => {
      if (countries.length > 0) return;
      try {
        const response = await globalApi.getCountries();
        setCountries(response.data || []);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };
    fetchCountries();
  }, [countries.length, setCountries]);
  return { countries };
};

export const useGetStates = (countryCode: string | null) => {
  const { statesByCountry, setStatesByCountry } = useGlobalStore();

  useEffect(() => {
    const fetchStates = async () => {
      if (!countryCode) {
        return;
      }

      // Check if states are already cached for this country
      if (statesByCountry[countryCode]) {
        return;
      }

      try {
        const response = await globalApi.getStates(countryCode);
        setStatesByCountry(countryCode, response.data || []);
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setStatesByCountry(countryCode, []);
      }
    };

    fetchStates();
  }, [countryCode, setStatesByCountry, statesByCountry]);

  return { states: countryCode ? statesByCountry[countryCode] || [] : [] };
};

export const useGetCities = (stateCode: string | null) => {
  const { cities, setCities } = useGlobalStore();

  useEffect(() => {
    const fetchCities = async () => {
      if (!stateCode) {
        setCities([]);
        return;
      }

      try {
        const response = await globalApi.getCities(stateCode);
        setCities(response.data || []);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        setCities([]);
      }
    };

    fetchCities();
  }, [stateCode, setCities]);

  return { cities };
};
