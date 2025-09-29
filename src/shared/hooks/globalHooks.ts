import { useEffect } from "react";
import { globalApi } from "../services/globalApi";
import { useGlobalStore } from "../store/globalStore";

export const useGetCountries = () => {
  const { countries, setCountries } = useGlobalStore();
  useEffect(() => {
    const fetchCountries = async () => {
      if (countries.length > 0) return;
      try {
        console.log("Fetching countries...");
        const response = await globalApi.getCountries();
        console.log("Countries API response:", response);
        console.log(
          "Countries fetched:",
          response.data?.length || 0,
          "countries"
        );
        if (response.data && response.data.length > 0) {
          console.log("First country:", response.data[0]);
        }
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
  const { states, setStates } = useGlobalStore();

  useEffect(() => {
    const fetchStates = async () => {
      if (!countryCode) {
        setStates([]);
        return;
      }

      try {
        console.log("Fetching states for country code:", countryCode);
        const response = await globalApi.getStates(countryCode);
        console.log("States API response:", response);
        console.log("States fetched:", response.data?.length || 0, "states");
        setStates(response.data || []);
      } catch (error) {
        console.error("Failed to fetch states:", error);
        setStates([]);
      }
    };

    fetchStates();
  }, [countryCode, setStates]);

  return { states };
};

export const useGetCities = (stateCode: string | null) => {
  const { cities, setCities } = useGlobalStore();

  useEffect(() => {
    const fetchCities = async () => {
      console.log("🏙️ useGetCities called with stateCode:", stateCode);
      if (!stateCode) {
        console.log("🏙️ No stateCode, clearing cities");
        setCities([]);
        return;
      }

      try {
        console.log("🏙️ Fetching cities for state code:", stateCode);
        const response = await globalApi.getCities(stateCode);
        console.log("🏙️ Cities API response:", response);
        console.log("🏙️ Cities fetched:", response.data?.length || 0, "cities");
        setCities(response.data || []);
      } catch (error) {
        console.error("🏙️ Failed to fetch cities:", error);
        setCities([]);
      }
    };

    fetchCities();
  }, [stateCode, setCities]);

  return { cities };
};
