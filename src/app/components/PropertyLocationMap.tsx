import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png';
const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface PropertyLocationMapProps {
  latitude: string;
  longitude: string;
  onLocationSelect: (lat: number, lng: number) => void;
}

export function PropertyLocationMap({ latitude, longitude, onLocationSelect }: PropertyLocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default to Bangalore coordinates
  const defaultLat = 12.9716;
  const defaultLng = 77.5946;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    const lat = latitude ? parseFloat(latitude) : defaultLat;
    const lng = longitude ? parseFloat(longitude) : defaultLng;
    
    const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
    const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;
    
    const center: [number, number] = [
      isValidLat ? lat : defaultLat,
      isValidLng ? lng : defaultLng
    ];

    mapRef.current = L.map(containerRef.current).setView(center, 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    // Add marker if coordinates are valid
    if (latitude && longitude && isValidLat && isValidLng) {
      markerRef.current = L.marker(center).addTo(mapRef.current);
    }

    // Add click handler
    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);

      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else if (mapRef.current) {
        markerRef.current = L.marker([lat, lng]).addTo(mapRef.current);
      }
    });

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update marker position when coordinates change externally
  useEffect(() => {
    if (!mapRef.current) return;

    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;

    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      const position: [number, number] = [lat, lng];
      
      if (markerRef.current) {
        markerRef.current.setLatLng(position);
      } else {
        markerRef.current = L.marker(position).addTo(mapRef.current);
      }
      
      mapRef.current.setView(position, 13);
    }
  }, [latitude, longitude]);

  return (
    <div className="relative">
      <div 
        ref={containerRef} 
        style={{ height: '280px', width: '100%', borderRadius: '16px' }}
        className="z-0"
      />
      
      {/* Instruction Overlay */}
      <div className="absolute top-4 left-4 right-4 bg-white/95 dark:bg-black/95 backdrop-blur-md 
                      border border-black/10 dark:border-white/10 rounded-lg px-4 py-2.5 
                      shadow-lg pointer-events-none z-[1000]">
        <p className="text-[12px] text-black/70 dark:text-white/70 flex items-center gap-2">
          <span className="text-emerald-500 text-[14px]">📍</span>
          Click anywhere on the map to set property location
        </p>
      </div>
    </div>
  );
}
