# Google Maps Integration Setup

This project includes Google Maps integration for location selection in project creation forms.

## Features

- **Manual Location Entry**: Enter location manually via text input
- **Google Maps Selection**: Choose location from an interactive map
- **Location Search**: Search for locations using Google Places Autocomplete
- **Current Location**: Use device's current location with one click
- **Map Click Selection**: Click anywhere on the map to select location
- **Reverse Geocoding**: Automatically convert coordinates to addresses

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API**
4. Go to **Credentials** and create an API key
5. (Optional but recommended) Restrict your API key:
   - Application restrictions: HTTP referrers
   - Add your domain (e.g., `https://yourdomain.com/*`)
   - API restrictions: Select only the APIs listed above

### 2. Add API Key to Environment Variables

Create a `.env.local` file in your project root and add:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Important**: The variable must start with `NEXT_PUBLIC_` to be accessible in client-side components.

### 3. Restart Development Server

After adding the environment variable, restart your Next.js development server:

```bash
npm run dev
```

## Usage

The `LocationInput` component is automatically integrated into the Essential Information form in project creation/editing:

```tsx
<LocationInput
  value={field.value}
  onChange={field.onChange}
  onCoordinatesChange={(lat, lng) => {
    // Optional: Save coordinates
    console.log('Coordinates:', lat, lng);
  }}
  disabled={false}
  placeholder="Enter project location"
/>
```

## User Interface

### Manual Entry Mode
- Text input field for typing location
- Map icon button to switch to map mode

### Map Selection Mode
- Interactive Google Map
- Search bar with autocomplete suggestions
- Current location button (requires browser permission)
- Click on map to select location
- Keyboard icon button to switch back to manual mode

## Default Configuration

- **Default Center**: Riyadh, Saudi Arabia (24.7136°N, 46.6753°E)
- **Country Restriction**: Saudi Arabia (can be modified in `GoogleMapLocationPicker.tsx`)
- **Zoom Level**: 10 (overview), 15 (with marker)
- **Map Controls**: 
  - ✅ Fullscreen
  - ❌ Street View
  - ❌ Map Type

## Customization

### Change Default Location

Edit `GoogleMapLocationPicker.tsx`:

```tsx
const [center, setCenter] = useState({ 
  lat: 24.7136, // Change latitude
  lng: 46.6753  // Change longitude
});
```

### Change Country Restriction

Edit the `Autocomplete` component options in `GoogleMapLocationPicker.tsx`:

```tsx
options={{
  componentRestrictions: { country: "sa" }, // Change country code
  types: ["geocode", "establishment"],
}}
```

### Add Coordinates to Form Data

If you want to save coordinates (latitude/longitude) along with the address, update your project store and API to handle these additional fields.

## Troubleshooting

### "API key not configured" Message

- Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in `.env.local`
- Restart the development server
- Check that the variable name starts with `NEXT_PUBLIC_`

### Map Not Loading

- Verify your API key is valid
- Check that all required APIs are enabled in Google Cloud Console
- Check browser console for specific error messages
- Ensure you're not hitting API quota limits

### Location Not Accurate

- Try using the search bar for better results
- Use the "current location" button for precise coordinates
- Click directly on the map for exact location

### Search Not Working

- Verify Places API is enabled in Google Cloud Console
- Check API key restrictions
- Ensure network connectivity

## API Costs

Google Maps Platform is **not entirely free**. Check the [pricing page](https://mapsplatform.google.com/pricing/) for details:

- First $200/month is free (covers ~28,000 map loads)
- After that, costs apply per API call
- Consider setting up billing alerts in Google Cloud Console

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Restrict your API key** to your domain in production
3. **Enable only required APIs**
4. **Set up billing alerts** to avoid unexpected charges
5. **Monitor API usage** regularly in Google Cloud Console

## Support

For issues specific to Google Maps API, refer to:
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)

