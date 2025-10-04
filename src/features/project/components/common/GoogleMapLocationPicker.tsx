"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];

interface GoogleMapLocationPickerProps {
  onLocationSelect: (location: string, lat?: number, lng?: number) => void;
  initialLocation?: string;
  apiKey?: string;
}

export const GoogleMapLocationPicker: React.FC<
  GoogleMapLocationPickerProps
> = ({ onLocationSelect, initialLocation, apiKey }) => {
  const t = useTranslations("project.step1");

  // Default to Riyadh, Saudi Arabia if no location provided
  const [center, setCenter] = useState({ lat: 24.7136, lng: 46.6753 });
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [searchValue, setSearchValue] = useState(initialLocation || "");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const googleMapsApiKey =
    apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Geocode initial location if provided
  useEffect(() => {
    if (initialLocation && window.google) {
      geocodeAddress(initialLocation);
    }
  }, [initialLocation]);

  const geocodeAddress = useCallback(
    (address: string) => {
      if (!window.google || !address) return;

      setIsLoadingLocation(true);
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address }, (results, status) => {
        setIsLoadingLocation(false);
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();

          setCenter({ lat, lng });
          setMarkerPosition({ lat, lng });
          mapRef.current?.panTo({ lat, lng });

          onLocationSelect(results[0].formatted_address, lat, lng);
        }
      });
    },
    [onLocationSelect]
  );

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    },
    []
  );

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        setSearchValue(place.formatted_address || place.name || "");

        mapRef.current?.panTo({ lat, lng });

        onLocationSelect(place.formatted_address || place.name || "", lat, lng);
      }
    }
  }, [onLocationSelect]);

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setMarkerPosition({ lat, lng });

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            setSearchValue(results[0].formatted_address);
            onLocationSelect(results[0].formatted_address, lat, lng);
          } else {
            onLocationSelect(`${lat}, ${lng}`, lat, lng);
          }
        });
      }
    },
    [onLocationSelect]
  );

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setCenter({ lat, lng });
          setMarkerPosition({ lat, lng });
          mapRef.current?.panTo({ lat, lng });

          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            setIsLoadingLocation(false);
            if (status === "OK" && results && results[0]) {
              setSearchValue(results[0].formatted_address);
              onLocationSelect(results[0].formatted_address, lat, lng);
            } else {
              onLocationSelect(`${lat}, ${lng}`, lat, lng);
            }
          });
        },
        (error) => {
          setIsLoadingLocation(false);
        }
      );
    }
  }, [onLocationSelect]);

  if (!googleMapsApiKey) {
    return (
      <div className="w-full p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 rounded-md">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          {t("mapApiKeyMissing") ||
            "Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={libraries}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Autocomplete
              onLoad={onLoad}
              onPlaceChanged={onPlaceChanged}
              className="flex-1"
              options={{
                componentRestrictions: { country: "sa" }, // Restrict to Saudi Arabia
                types: ["geocode", "establishment"],
              }}
            >
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={
                    t("searchLocation") || "Search for a location..."
                  }
                  className="pl-10"
                />
              </div>
            </Autocomplete>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              title={t("useCurrentLocation") || "Use current location"}
            >
              {isLoadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
            </Button>
          </div>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={markerPosition ? 15 : 10}
            onClick={onMapClick}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>

          <p className="text-xs text-muted-foreground">
            {t("mapClickInstruction") ||
              "Click on the map to select a location or search for an address above."}
          </p>
        </div>
      </LoadScript>
    </div>
  );
};
