
import React, { useEffect } from "react";
import api from "@/lib/api";

const GetCountryToDisplay = async ({ country_id }: { country_id: number | null }) => {
  if (!country_id) {
    return null;
  }
  const response = await api.get(`/world/countries/${country_id}`);
  const country = response.data;
  useEffect(() => {
    if (country) {
      return country;
    }
  }, [country]);
  return country;
};

export default GetCountryToDisplay;
