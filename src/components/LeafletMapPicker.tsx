import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    L?: any;
  }
}

interface Props {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

const loadLeaflet = async () => {
  if (window.L) return;

  if (!document.querySelector('link[data-leaflet]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.setAttribute('data-leaflet', 'true');
    document.head.appendChild(link);
  }

  await new Promise<void>((resolve, reject) => {
    if (document.querySelector('script[data-leaflet]')) {
      const check = window.setInterval(() => {
        if (window.L) {
          window.clearInterval(check);
          resolve();
        }
      }, 100);
      window.setTimeout(() => {
        window.clearInterval(check);
        reject(new Error('Leaflet load timeout'));
      }, 5000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.setAttribute('data-leaflet', 'true');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Cannot load leaflet script'));
    document.body.appendChild(script);
  });
};

export const LeafletMapPicker = ({ lat, lng, onChange }: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await loadLeaflet();
        if (!mounted || !rootRef.current || mapRef.current || !window.L) return;

        mapRef.current = window.L.map(rootRef.current).setView([lat, lng], 12);
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(mapRef.current);

        markerRef.current = window.L.marker([lat, lng]).addTo(mapRef.current);

        mapRef.current.on('click', (e: any) => {
          const { lat: newLat, lng: newLng } = e.latlng;
          markerRef.current?.setLatLng([newLat, newLng]);
          onChange(newLat, newLng);
        });
      } catch {
        // noop
      }
    };

    init();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return;
    markerRef.current.setLatLng([lat, lng]);
    mapRef.current.panTo([lat, lng]);
  }, [lat, lng]);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={1}>
        روی نقشه کلیک کنید تا موقعیت پروژه انتخاب شود.
      </Typography>
      <Box ref={rootRef} sx={{ height: 320, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }} />
    </Box>
  );
};
