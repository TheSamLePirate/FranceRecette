import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression, Layer } from 'leaflet';
import { useFranceData } from '../hooks/useFranceData';

// Fix for default marker icon in Leaflet with Webpack/Vite
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface SelectedDept {
  code: string;
  nom: string;
  specialite: string;
}

interface MapPosition {
  center: LatLngExpression;
  zoom: number;
  name: string;
}

// Predefined map positions for different territories
const MAP_POSITIONS: Record<string, MapPosition> = {
  france: { center: [46.603354, 1.888334], zoom: 6, name: 'France métropolitaine' },
  paris: { center: [48.8566, 2.3522], zoom: 9, name: 'Île-de-France' },
  guadeloupe: { center: [16.265, -61.551], zoom: 9, name: 'Guadeloupe' },
  martinique: { center: [14.641, -61.024], zoom: 10, name: 'Martinique' },
  guyane: { center: [3.933, -53.125], zoom: 7, name: 'Guyane' },
  reunion: { center: [-21.115, 55.536], zoom: 9, name: 'La Réunion' },
  mayotte: { center: [-12.827, 45.166], zoom: 10, name: 'Mayotte' },
};

// Component to control map position
const MapController = ({ position }: { position: MapPosition }) => {
  const map = useMap();
  
  const handleFlyTo = () => {
    map.flyTo(position.center, position.zoom, {
      duration: 1.5
    });
  };

  // Call flyTo when position changes
  if (map) {
    handleFlyTo();
  }

  return null;
};

const FranceMap = () => {
  const { geoJsonData, specialties, loading, error } = useFranceData();
  const [clickedDepartments, setClickedDepartments] = useState<Set<string>>(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState<SelectedDept | null>(null);
  const [isSpecialtyRevealed, setIsSpecialtyRevealed] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<MapPosition>(MAP_POSITIONS.france);
  const [territoryLabels, setTerritoryLabels] = useState<Array<{code: string, label: string, position: [number, number]}>>([]);

  const mapStyle = useCallback((feature: any) => {
    const code = feature.properties.code;
    const isClicked = clickedDepartments.has(code);
    
    // Red for clicked, Green for others
    const color = isClicked ? '#ef4444' : '#22c55e';

    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: '#000000',
      dashArray: '0',
      fillOpacity: 0.7
    };
  }, [clickedDepartments]);

  const onEachFeature = useCallback((feature: any, layer: Layer) => {
    const code = feature.properties.code;
    const nom = feature.properties.nom;
    
    // Determine if it's a DOM-TOM (codes >= 971) or metropolitan department
    const isDomTom = parseInt(code) >= 971;
    
    // Create label: show code for departments, name for DOM-TOM
    const label = isDomTom ? nom : code;
    
    // Calculate centroid of the polygon
    const bounds = (layer as any).getBounds();
    const centroid = bounds.getCenter();
    
    // Store label info for rendering as markers
    setTerritoryLabels(prev => [...prev, {
      code,
      label,
      position: [centroid.lat, centroid.lng]
    }]);
    
    layer.on({
      click: () => {
        const specialty = specialties[code] || 'Spécialité non trouvée';
        
        // Update clicked state
        setClickedDepartments(prev => {
            const newSet = new Set(prev);
            newSet.add(code);
            return newSet;
        });
        
        // Reset revealed state
        setIsSpecialtyRevealed(false);
        
        // Set selected department for display
        setSelectedDepartment({ code, nom, specialite: specialty });
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#000000',
          dashArray: '0',
          fillOpacity: 0.9
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: '#000000',
          dashArray: '0',
          fillOpacity: 0.7
        });
      }
    });
  }, [specialties]);

  if (loading) return <div className="flex justify-center items-center h-[600px]">Chargement de la carte...</div>;
  if (error) return <div className="flex justify-center items-center h-[600px] text-red-500">Erreur: {error}</div>;

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Navigation Buttons */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-wrap gap-2 max-w-xs">
        {Object.entries(MAP_POSITIONS).map(([key, pos]) => (
          <button
            key={key}
            onClick={() => setCurrentPosition(pos)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg shadow-md transition-all duration-200 ${
              currentPosition.name === pos.name
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            {pos.name}
          </button>
        ))}
      </div>

      <MapContainer center={currentPosition.center} zoom={currentPosition.zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        />
        <MapController position={currentPosition} />
        {geoJsonData && (
          <GeoJSON 
            // Key ensures re-render when clickedDepartments changes to update colors
            key={clickedDepartments.size} 
            data={geoJsonData} 
            style={mapStyle} 
            onEachFeature={onEachFeature}
          />
        )}
        
        {/* Render labels as DivIcon markers */}
        {territoryLabels.map((territory) => {
          const icon = L.divIcon({
            className: 'department-label-marker',
            html: `<span class="department-label-text">${territory.label}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0]
          });
          
          return (
            <Marker 
              key={territory.code}
              position={territory.position}
              icon={icon}
              interactive={false}
            />
          );
        })}
      </MapContainer>

      {/* Specialty Card Overlay */}
      {selectedDepartment && (
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-100 max-w-xs transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800">{selectedDepartment.nom}</h3>
            <span className="text-xs font-mono bg-gray-200 text-gray-600 px-2 py-1 rounded">
              {selectedDepartment.code}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Spécialité culinaire</p>
            
            {!isSpecialtyRevealed ? (
              <button 
                onClick={() => setIsSpecialtyRevealed(true)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>Voir la réponse</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            ) : (
              <div className="animate-in fade-in zoom-in duration-300">
                <p className="text-lg text-blue-600 font-medium p-3 bg-blue-50 rounded-lg border border-blue-100">
                  {selectedDepartment.specialite}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FranceMap;
