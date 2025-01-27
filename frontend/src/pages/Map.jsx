import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '2rem'
  },
  mapContainer: {
    height: '70vh',
    width: '1200px',
    maxWidth: '1200px',
    borderRadius: '8px',
    border: '2px solid #646cff',
    zIndex: 1,
    margin: '0 auto'
  },
  filterContainer: {
    marginBottom: '1rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    width: '100%'
  },
  select: {
    padding: '0.5rem',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a',
    color: 'white',
    border: '1px solid #646cff',
    cursor: 'pointer'
  },
  label: {
    marginRight: '0.5rem',
    color: '#646cff'
  }
};

function Map() {
  const [towers, setTowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    operator: 'all',
    technology: 'all'
  });

  const operators = [...new Set(towers.map(tower => tower.operator_str))];
  const technologies = [...new Set(towers.map(tower => tower.rat))];

  // Function to fetch tower data
  const fetchTowers = async () => {
    try {
      const response = await fetch('/api/towers');
      if (!response.ok) throw new Error('Failed to fetch tower data');
      const data = await response.json();
      setTowers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTowers();
  }, []);

  // Set up polling for updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTowers();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const filteredTowers = towers.filter(tower => {
    if (filters.operator !== 'all' && tower.operator_str !== filters.operator) return false;
    if (filters.technology !== 'all' && tower.rat !== filters.technology) return false;
    return true;
  });

  // Set default center to a fallback position if no towers are available
  const defaultCenter = [0, 0];
  const center = filteredTowers.length > 0 && filteredTowers[0].analysis_report?.pcaps[0]?.gnss_position
    ? [
        filteredTowers[0].analysis_report.pcaps[0].gnss_position.latitude,
        filteredTowers[0].analysis_report.pcaps[0].gnss_position.longitude
      ]
    : defaultCenter;

  if (loading) return <div style={styles.container}>Loading map data...</div>;
  if (error) return <div style={styles.container}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.filterContainer}>
        <div>
          <label style={styles.label}>Service Provider:</label>
          <select 
            style={styles.select}
            value={filters.operator}
            onChange={(e) => setFilters({...filters, operator: e.target.value})}
          >
            <option value="all">All Providers</option>
            {operators.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Technology:</label>
          <select 
            style={styles.select}
            value={filters.technology}
            onChange={(e) => setFilters({...filters, technology: e.target.value})}
          >
            <option value="all">All Technologies</option>
            {technologies.map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.mapContainer}>
        <MapContainer 
          center={center} 
          zoom={5} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          {filteredTowers.map((tower) => {
            const position = tower.analysis_report?.pcaps[0]?.gnss_position;
            if (!position) return null;

            return (
              <Marker 
                key={`${tower.ci}-${tower.timestamp}`} // Add timestamp for uniqueness
                position={[position.latitude, position.longitude]}
              >
                <Popup>
                  <div>
                    <h3>Tower Details</h3>
                    <p>Operator: {tower.operator_str}</p>
                    <p>Technology: {tower.rat}</p>
                    <p>MNC: {tower.mnc}</p>
                    <p>TAC: {tower.tac}</p>
                    <p>CI: {tower.ci}</p>
                    <p>PCI: {tower.pci}</p>
                    <p>Frequency: {tower.freq}</p>
                    <p>Signal Power: {tower.signal_power} dBm</p>
                    <p>Signal Quality: {tower.signal_quality} dB</p>
                    <p>Last Updated: {new Date(tower.timestamp).toLocaleString()}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;