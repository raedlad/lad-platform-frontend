import { ApiResponse } from "@/features/auth/types/auth";
import { Country, State, City } from "@/types/globalTypes";
import { api } from "@/lib/api";

export const globalApi = {
  getCountries: async (): Promise<ApiResponse<Country[]>> => {
    const response = await api.get<{ success: boolean; response: Country[] }>(
      "/world/countries"
    );
    return {
      success: response.data.success,
      data: response.data.response,
    };
  },

  getStates: async (countryCode: string): Promise<ApiResponse<State[]>> => {
    const response = await api.get<{ success: boolean; response: State[] }>(
      `/world/countries/${countryCode}/states`
    );
    return {
      success: response.data.success,
      data: response.data.response,
    };
  },

  getCities: async (stateCode: string): Promise<ApiResponse<City[]>> => {
    const response = await api.get<{ success: boolean; response: City[] }>(
      `/world/states/${stateCode}/cities`
    );
    return {
      success: response.data.success,
      data: response.data.response,
    };
  },

  getAllCities: async (): Promise<ApiResponse<City[]>> => {
    const response = await api.get<{ success: boolean; response: City[] }>(
      "/world/cities"
    );
    return {
      success: response.data.success,
      data: response.data.response,
    };
  },
};
