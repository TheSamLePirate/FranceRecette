import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import Papa from 'papaparse';

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

interface Specialty {
  code: string;
  nom: string;
  specialite: string;
}

interface SelectedDept {
  code: string;
  nom: string;
  specialite: string;
}

const FranceMap = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [specialties, setSpecialties] = useState<Record<string, string>>({});
  const [clickedDepartments, setClickedDepartments] = useState<Set<string>>(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState<SelectedDept | null>(null);
  const [isSpecialtyRevealed, setIsSpecialtyRevealed] = useState(false);

  useEffect(() => {
    // Fetch GeoJSON
    fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson')
      .then(response => response.json())
      .then(data => setGeoJsonData(data))
      .catch(error => console.error('Error loading GeoJSON:', error));

    // Fetch and parse CSV
    Papa.parse<Specialty>('/specialties.csv', {
      download: true,
      header: true,
      complete: (results: Papa.ParseResult<Specialty>) => {
        const specialtyMap: Record<string, string> = {};
        results.data.forEach((item: Specialty) => {
          if (item.code && item.specialite) {
            specialtyMap[item.code] = item.specialite;
          }
        });
        setSpecialties(specialtyMap);
      },
      error: (error: Error) => console.error('Error loading CSV:', error)
    });
  }, []);

  const mapStyle = (feature: any) => {
    const code = feature.properties.code;
    const isClicked = clickedDepartments.has(code);
    
    // Red for clicked, Green for others
    const color = isClicked ? '#ef4444' : '#22c55e';

    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      click: () => {
        const code = feature.properties.code;
        const nom = feature.properties.nom;
        const specialty = specialties[code] || 'Spécialité non trouvée';
        
        // Update clicked state
        setClickedDepartments(prev => new Set(prev).add(code));
        
        // Reset revealed state
        setIsSpecialtyRevealed(false);
        
        // Set selected department for display
        setSelectedDepartment({ code, nom, specialite: specialty });
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
        });
      }
    });
  };

  const position: LatLngExpression = [46.603354, 1.888334]; // Center of France

  return (
    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <MapContainer center={position} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        />
        {geoJsonData && (
          <GeoJSON 
            // Key ensures re-render when clickedDepartments changes to update colors
            key={clickedDepartments.size} 
            data={geoJsonData} 
            style={mapStyle} 
            onEachFeature={onEachFeature}
          />
        )}
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
