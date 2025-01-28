import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const styles = {
  container: {
    width: '100%',
    height: '80vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box'
  },
  filterContainer: {
    marginBottom: '20px',
    display: 'flex',
    gap: '20px'
  },
  label: {
    marginRight: '10px',
    fontWeight: 'bold'
  },
  select: {
    padding: '5px',
    borderRadius: '4px'
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    minHeight: '520px'
  }
};

const normalIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

const warningIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

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

  useEffect(() => {
    fetchTowers();
    const intervalId = setInterval(fetchTowers, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredTowers = towers.filter(tower => {
    if (filters.operator !== 'all' && tower.operator_str !== filters.operator) return false;
    if (filters.technology !== 'all' && tower.rat !== filters.technology) return false;
    return true;
  });

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
    <>
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
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredTowers.map((tower) => {
            const position = tower.analysis_report?.pcaps[0]?.gnss_position;
            if (!position) return null;

            return (
              <Marker 
                key={`${tower.ci}-${tower.timestamp}`}
                position={[position.latitude, position.longitude]}
                icon={tower.locationChanged ? warningIcon : normalIcon}
              >
                <Popup>
                  <div>
                    <h3>Tower Details</h3>
                    {tower.locationChanged && (
                      <p style={{color: 'red', fontWeight: 'bold'}}>
                        Warning: Tower location has changed since the last scan!
                      </p>
                    )}
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
    </>
  );
}

export default Map;