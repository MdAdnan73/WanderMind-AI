import { useEffect, useRef } from 'react';
import { PlacesResult } from '@/lib/agents/enhanced-places-agent';
import { RentalResult } from '@/lib/agents/rental-agent';

// Dynamic import to avoid SSR issues
let L: any;
if (typeof window !== 'undefined') {
  L = require('leaflet');
  // Fix for default marker icon
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface MapComponentProps {
  latitude: number;
  longitude: number;
  places?: PlacesResult | null;
  rentals?: RentalResult | null;
}

export default function MapComponent({ latitude, longitude, places, rentals }: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || typeof window === 'undefined' || !L) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([latitude, longitude], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add main location marker
    const mainIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.marker([latitude, longitude], { icon: mainIcon })
      .addTo(map)
      .bindPopup('Your destination');

    // Add attraction markers
    if (places) {
      const attractionIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      [...places.attractions, ...places.hiddenGems].forEach((place) => {
        if (place.latitude && place.longitude) {
          L.marker([place.latitude, place.longitude], { icon: attractionIcon })
            .addTo(map)
            .bindPopup(`📍 ${place.name}`);
        }
      });

      // Add restaurant markers
      const restaurantIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      places.restaurants.forEach((restaurant) => {
        if (restaurant.latitude && restaurant.longitude) {
          L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon })
            .addTo(map)
            .bindPopup(`🍴 ${restaurant.name}`);
        }
      });
    }

    // Add rental markers
    if (rentals) {
      const rentalIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      rentals.rentals.forEach((rental) => {
        if (rental.latitude && rental.longitude) {
          L.marker([rental.latitude, rental.longitude], { icon: rentalIcon })
            .addTo(map)
            .bindPopup(`🚲 ${rental.name} (${rental.type})`);
        }
      });
    }

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, places, rentals]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}

