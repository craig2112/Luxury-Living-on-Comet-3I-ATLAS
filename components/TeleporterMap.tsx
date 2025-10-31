import React, { useLayoutEffect, useRef } from 'react';
import { City } from '../types';
import { StarField } from './StarField';
import L from 'leaflet';
import { cities } from '../data/cities';

// Helper to shuffle array and pick N items
function getRandomCities(arr: City[], n: number): City[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

interface TeleporterMapProps {
  onBack: () => void;
  onCitySelect: (city: City) => void;
}

const TeleporterMap: React.FC<TeleporterMapProps> = ({ onBack, onCitySelect }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const locationsRef = useRef<City[]>(getRandomCities(cities, 10));

    useLayoutEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [20, 0],
                zoom: 2,
                minZoom: 2,
                maxBounds: [[-90,-180], [90,180]],
                scrollWheelZoom: true, // Enable scroll wheel zoom by default
            });
            mapRef.current = map;

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }).addTo(map);

            const teleporterIcon = L.divIcon({
              className: 'teleporter-pin-container',
              html: `<div class="teleporter-pin"></div>`,
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            });

            locationsRef.current.forEach(city => {
                const marker = L.marker([city.lat, city.lng], { icon: teleporterIcon }).addTo(map);
                marker.on('mouseover', () => {
                    marker.bindTooltip(city.name, { permanent: false, direction: 'top', sticky: true }).openTooltip();
                });
                marker.on('mouseout', () => {
                    marker.closeTooltip();
                });
                marker.on('click', () => {
                    onCitySelect(city);
                });
            });
            
            // This ensures the map knows its container's size after the DOM is updated.
            setTimeout(() => map.invalidateSize(), 0);
        }
        
        // Cleanup function to remove the map instance when the component unmounts.
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount.

    return (
        <div className="relative w-screen h-screen bg-stone-950 text-gray-200 flex flex-col items-center justify-center p-4 overflow-hidden">
            <StarField />
            <div className="relative z-10 text-center w-full max-w-6xl mx-auto">
                <h1 className="font-orbitron text-3xl md:text-5xl font-bold text-cyan-400 text-glow mb-2">
                    StarCast Teleporter Network
                </h1>
                <p className="text-gray-400 mb-8">Hover to identify, click to select a teleporter location.</p>
                
                <div className="relative w-full aspect-[2/1] bg-black/30 rounded-lg border border-cyan-500/30 p-2 card-glow overflow-hidden">
                     <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
                </div>

                <button 
                    onClick={onBack}
                    className="mt-8 bg-cyan-500/20 border border-cyan-500 text-cyan-300 font-bold py-2 px-6 rounded-lg hover:bg-cyan-500/40 transition-colors font-orbitron"
                >
                    Back to Condos
                </button>
            </div>
        </div>
    );
};

export default TeleporterMap;