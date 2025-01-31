import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    gap: '5px',
    boxSizing: 'border-box',
    alignItems: 'flex-end',
  },
  filterContainer: {
    alignSelf: 'flex-left',
    width: '250px',
    minWidth: '200px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    height: '88vh',
    overflowY: 'auto',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontWeight: 'bold',
    color: '#646cff',
    marginBottom: '8px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-left',
    gap: '8px',
    color: '#ffffff'
  },
  checkbox: {
    margin: 0
  },
  mapContainer: {
    position: 'end',
    borderRadius: '8px',
    overflow: 'hidden',
    height: '720px',
    width: '1750px',
    alignSelf: 'flex-end'
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
    operator: [],
    technology: []
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

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter(item => item !== value)
        : [...prevFilters[filterType], value]
    }));
  };

  const filteredTowers = towers.filter(tower => {
    if (filters.operator.length > 0 && !filters.operator.includes(tower.operator_str)) return false;
    if (filters.technology.length > 0 && !filters.technology.includes(tower.rat)) return false;
    return true;
  });

  const defaultCenter = [0, 0];
  const center = filteredTowers.length > 0 && filteredTowers[0].analysis_report?.pcaps[0]?.gnss_position
    ? [
        filteredTowers[0].analysis_report.pcaps[0].gnss_position.latitude,
        filteredTowers[0].analysis_report.pcaps[0].gnss_position.longitude
      ]
    : defaultCenter;

  if (loading) return <div>Loading map data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.filterContainer}>
      <input
          type="text"
          placeholder="Search by CI number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.filterGroup}>
          <div style={styles.label}>Service Provider</div>
          {operators.map(op => (
            <label key={op} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={filters.operator.includes(op)}
                onChange={() => handleFilterChange('operator', op)}
              />
              {op}
            </label>
          ))}
        </div>

        <div style={styles.filterGroup}>
          <div style={styles.label}>Technology</div>
          {technologies.map(tech => (
            <label key={tech} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                style={styles.checkbox}
                checked={filters.technology.includes(tech)}
                onChange={() => handleFilterChange('technology', tech)}
              />
              {tech}
            </label>
          ))}
        </div>
      </div>

      <div style={styles.mapContainer}>
        <MapContainer 
          center={center} 
          zoom={5} 
          style={styles.mapContainer}
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
                icon={tower.kingfisher_id_changed ? warningIcon : normalIcon}
              >
                <Popup>
                  <div>
                    <h3>Tower Details</h3>
                    {tower.kingfisher_id_changed && (
                      <p style={{color: 'red', fontWeight: 'bold'}}>
                        Warning: This tower has been detected by a different Kingfisher device.
                      </p>
                    )}
                    <p>Operator: {tower.operator_str}</p>
                    <p>Technology: {tower.rat}</p>
                    <p>CI: {tower.ci}</p>
                    <p>Frequency: {tower.freq}</p>
                    <p>Signal Power: {tower.signal_power} dBm</p>
                    <p>Signal Quality: {tower.signal_quality} dB</p>
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