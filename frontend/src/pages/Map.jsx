import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const styles = {
  container: {
    position: 'fixed',
    top: '64px',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#121212'
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: '1rem',
    width: '250px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    marginLeft: 'auto'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    marginRight: '0.5rem',
    color: '#646cff'
  },
  mapWrapper: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    marginRight: '1rem'
  },
  searchInput: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.9rem'
  },
  loadingText: {
    textAlign: 'center',
    padding: '20px',
    color: '#fff'
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    padding: '20px'
  },
  popup: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '1rem',
    borderRadius: '4px'
  },
  popupTitle: {
    color: '#646cff',
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    borderBottom: '1px solid #333',
    paddingBottom: '0.5rem'
  },
  popupRow: {
    marginBottom: '0.5rem'
  },
  popupWarning: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginBottom: '0.5rem'
  }
};

const getIcon = (score, hasWarning) => {
  if (hasWarning) {
    return new Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  }

  let color;
  switch (true) {
    case score === null:
      color = 'blue';
      break;
    case score === 0:
      color = 'green';
      break;
    case score === 100:
      color = 'red';
      break;
    default:
      color = 'orange';
  }

  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });
};

const scoreRanges = [
  { label: 'Null', value: 'null' },
  { label: '0', value: '0' },
  { label: '1-99', value: 'middle' },
  { label: '<99', value: '100' }
];

function Map() {
  const [towers, setTowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    operator: [],
    technology: [],
    score: [],
    timeRange: []
  });
  const timeRanges = [
    { label: '< 1 hour', value: '1h' },
    { label: '< 3 hours', value: '3h' },
    { label: '< 6 hours', value: '6h' },
    { label: '< 12 hours', value: '12h' },
    { label: '< 24 hours', value: '24h' },
    { label: '> 24 hours', value: 'older' }
  ];
  const operators = [...new Set(towers.map(tower => tower.operator_short_str))];
  const technologies = [...new Set(towers.map(tower => tower.rat))];

  const isInTimeRange = (lastModified, range) => {
    if (!lastModified) return false;
    const date = new Date(lastModified);
    const now = new Date();
    const hoursDiff = (now - date) / (1000 * 60 * 60);
  
    switch (range) {
      case '1h':
        return hoursDiff < 1;
      case '3h':
        return hoursDiff < 3;
      case '6h':
        return hoursDiff < 6;
      case '12h':
        return hoursDiff < 12;
      case '24h':
        return hoursDiff < 24;
      case 'older':
        return hoursDiff >= 24;
      default:
        return true;
    }
  };

  const fetchTowers = async () => {
    try {
      const response = await fetch('/api/towers', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch tower data');
      const newData = await response.json();
      setTowers(newData);
    } catch (err) {
      setError(err.message);
    } finally {
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

  const isScoreInRange = (score, range) => {
    switch (range) {
      case 'null':
        return score === null;
      case '0':
        return score === 0;
      case 'middle':
        return score > 0 && score < 100;
      case '100':
        return score === 100;
      default:
        return true;
    }
  };

  const filteredTowers = towers.filter(tower => {
    if (searchTerm && !tower.ci.toString().includes(searchTerm)) return false;
    if (filters.operator.length > 0 && !filters.operator.includes(tower.operator_short_str)) return false;
    if (filters.technology.length > 0 && !filters.technology.includes(tower.rat)) return false;
    if (filters.score.length > 0 && !filters.score.some(range => 
      isScoreInRange(tower.analysis_report?.score, range)
    )) return false;
    if (filters.timeRange.length > 0 && !filters.timeRange.some(range =>
      isInTimeRange(tower.last_modified, range)
    )) return false;
    return true;
  });

  const defaultCenter = [0, 0];
  const center = filteredTowers.length > 0 && filteredTowers[0].analysis_report?.pcaps[0]?.gnss_position
    ? [
        filteredTowers[0].analysis_report.pcaps[0].gnss_position.latitude,
        filteredTowers[0].analysis_report.pcaps[0].gnss_position.longitude
      ]
    : defaultCenter;

  if (loading) return <div style={styles.loadingText}>Loading map data...</div>;
  if (error) return <div style={styles.errorText}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.mapWrapper}>
        <MapContainer 
          center={center} 
          zoom={5} 
          style={{ width: '100%', height: '100%', borderRadius: '4px' }}
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
                icon={getIcon(tower.analysis_report.score, tower.kingfisher_id_changed)}
              >
                <Popup>
                  <div style={styles.popup}>
                    <div style={styles.popupTitle}>Tower Details</div>
                    {tower.kingfisher_id_changed && (
                      <div style={styles.popupWarning}>
                        Warning: This tower has been detected by a different Kingfisher device.
                      </div>
                    )}
                    <div style={styles.popupRow}>Operator: {tower.operator_short_str}</div>
                    <div style={styles.popupRow}>RAT: {tower.rat}</div>
                    <div style={styles.popupRow}>Frequency: {tower.freq}</div>
                    <div style={styles.popupRow}>Distance: {tower.analysis_report.distance_in_meters}</div>
                    <div style={styles.popupRow}>Score: {tower.analysis_report.score}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div style={styles.filterContainer}>
        <input
          type="text"
          placeholder="Search by CI number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        
        <div>
          <label style={styles.label}>Service Provider:</label>
          <div style={styles.checkboxGroup}>
            {operators.map(op => (
              <label key={op}>
                <input 
                  type="checkbox" 
                  checked={filters.operator.includes(op)}
                  onChange={() => handleFilterChange('operator', op)}
                />
                {op}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={styles.label}>RAT:</label>
          <div style={styles.checkboxGroup}>
            {technologies.map(tech => (
              <label key={tech}>
                <input 
                  type="checkbox" 
                  checked={filters.technology.includes(tech)}
                  onChange={() => handleFilterChange('technology', tech)}
                />
                {tech}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={styles.label}>Score Range:</label>
          <div style={styles.checkboxGroup}>
            {scoreRanges.map(range => (
              <label key={range.value}>
                <input 
                  type="checkbox" 
                  checked={filters.score.includes(range.value)}
                  onChange={() => handleFilterChange('score', range.value)}
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={styles.label}>Last Modified:</label>
          <div style={styles.checkboxGroup}>
            {timeRanges.map(range => (
              <label key={range.value}>
                <input 
                  type="checkbox"
                  checked={filters.timeRange.includes(range.value)}
                  onChange={() => handleFilterChange('timeRange', range.value)}
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;