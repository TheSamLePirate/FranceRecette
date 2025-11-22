import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface Specialty {
  code: string;
  nom: string;
  specialite: string;
}

export const useFranceData = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [specialties, setSpecialties] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch GeoJSON from local file (includes metropolitan departments and DOM-TOM regions)
        const geoResponse = await fetch('/france-complete.geojson');
        if (!geoResponse.ok) throw new Error('Failed to fetch GeoJSON');
        const geoData = await geoResponse.json();
        setGeoJsonData(geoData);

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
            setLoading(false);
          },
          error: (err: Error) => {
            console.error('Error loading CSV:', err);
            setError('Failed to load specialties');
            setLoading(false);
          }
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { geoJsonData, specialties, loading, error };
};
