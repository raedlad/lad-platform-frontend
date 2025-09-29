interface Country {
  id: number;
  iso2: string;
  iso3: string;
  name: string;
  phone_code: string;
  dialling_pattern: string;
  formatted_phone_code: string;
  region: string;
  sub_region: string;
  full_location: string;
  is_active: boolean;
  sort_order: number;
  has_states: boolean;
  has_cities: boolean;
  created_at: string;
  updated_at: string;
}

interface State {
  id: number;
  country_id: number;
  name: string;
  full_location: string;
  full_location_with_region: string;
  is_active: boolean;
  sort_order: number;
  has_cities: boolean;
  country: {
    id: number;
    iso2: string;
    iso3: string;
    name: string;
    phone_code: string;
    dialling_pattern: string;
    formatted_phone_code: string;
    region: string;
    sub_region: string;
    full_location: string;
    is_active: boolean;
    sort_order: number;
    has_states: boolean;
    has_cities: boolean;
    created_at: string;
    updated_at: string;
  };
  country_iso2: string;
  country_iso3: string;
  country_phone_code: string;
  country_region: string;
  country_sub_region: string;
  created_at: string;
  updated_at: string;
}

interface City {
  id: number;
  name: string;
  state_id?: number;
  state_code?: string;
  country_id: number;
  country_code: string;
}

export type { Country, State, City };
