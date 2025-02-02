import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import api from '../config/api.config.js';

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
  tableWrapper: {
    flex: 1,
    overflow: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  th: {
    backgroundColor: '#2a2a2a',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #333'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #333',
    transition: 'background-color 0.3s ease'
  },
  updatedRow: {
    backgroundColor: 'rgba(100, 108, 255, 0.2)'
  },
  loadingText: {
    textAlign: 'center',
    padding: '20px'
  },
  errorText: {
    color: '#ff6b6b',
    textAlign: 'center',
    padding: '20px'
  },
  button: {
    background: '#646cff',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  },
  dialog: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: '2rem',
    minWidth: '600px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  dialogTitle: {
    color: '#646cff',
    fontSize: '1.5rem',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #333',
    paddingBottom: '0.5rem',
    position: 'relative'
  },
  dialogSection: {
    backgroundColor: '#2a2a2a',
    padding: '1rem',
    borderRadius: '4px'
  },
  dialogSectionTitle: {
    color: '#646cff',
    fontSize: '1.1rem',
    marginBottom: '1rem'
  },
  dialogRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    color: '#fff'
  },
  dialogLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    minWidth: '120px'
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'transparent',
    border: '1px solid #646cff',
    color: '#646cff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

function TowerDetails({ tower, open, onClose }) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ style: styles.dialog }}
    >
      <div style={styles.dialogContent}>
        <div style={styles.dialogTitle}>
          Tower Details
          <button style={styles.closeButton} onClick={onClose}>Close</button>
        </div>

        {/* Basic Information Section */}
        <div style={styles.dialogSection}>
          <div style={styles.dialogSectionTitle}>Basic Information</div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Operator:</span>
            <span>{tower.operator_str}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Technology:</span>
            <span>{tower.rat}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Last Update:</span>
            <span>{new Date(tower.timestamp).toLocaleString()}</span>
          </div>
        </div>

        {/* Network Information Section */}
        <div style={styles.dialogSection}>
          <div style={styles.dialogSectionTitle}>Network Information</div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>MCC:</span>
            <span>{tower.mcc}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>MNC:</span>
            <span>{tower.mnc}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>TAC:</span>
            <span>{tower.tac}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>CI:</span>
            <span>{tower.ci}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>PCI:</span>
            <span>{tower.pci}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Frequency:</span>
            <span>{tower.freq}</span>
          </div>
        </div>

        {/* Signal Information Section */}
        <div style={styles.dialogSection}>
          <div style={styles.dialogSectionTitle}>Signal Information</div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Signal Power:</span>
            <span>{tower.signal_power} dBm</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Signal Quality:</span>
            <span>{tower.signal_quality} dB</span>
          </div>
        </div>

        {/* Analysis Report Section */}
        {tower.analysis_report && (
          <div style={styles.dialogSection}>
            <div style={styles.dialogSectionTitle}>Analysis Report</div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Score:</span>
              <span>{tower.analysis_report.score}</span>
            </div>
            {tower.analysis_report.distance_in_meters && (
              <div style={styles.dialogRow}>
                <span style={styles.dialogLabel}>Distance:</span>
                <span>{tower.analysis_report.distance_in_meters} meters</span>
              </div>
            )}
            {tower.analysis_report.pcaps && tower.analysis_report.pcaps[0]?.gnss_position && (
              <div style={styles.dialogRow}>
                <span style={styles.dialogLabel}>Location:</span>
                <span>
                  Lat: {tower.analysis_report.pcaps[0].gnss_position.latitude}, 
                  Lon: {tower.analysis_report.pcaps[0].gnss_position.longitude}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Fingerprints Section */}
        {tower.fingerprints && Object.keys(tower.fingerprints).length > 0 && (
          <div style={styles.dialogSection}>
            <div style={styles.dialogSectionTitle}>Fingerprints</div>
            {Object.entries(tower.fingerprints).map(([key, value]) => (
              <div key={key} style={styles.dialogRow}>
                <span style={styles.dialogLabel}>{key}:</span>
                <span>{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
}

function Data() {
  const [towers, setTowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);
  const [filters, setFilters] = useState({
    operator: [],
    technology: []
  });
  const [updatedTowers, setUpdatedTowers] = useState(new Set());

  const operators = [...new Set(towers.map(tower => tower.operator_str))];
  const technologies = [...new Set(towers.map(tower => tower.rat))];

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

  const filteredTowers = towers.filter(tower => {
    if (filters.operator.length > 0 && !filters.operator.includes(tower.operator_str)) return false;
    if (filters.technology.length > 0 && !filters.technology.includes(tower.rat)) return false;
    return true;
  });

  if (loading) return <div style={styles.loadingText}>Loading tower data...</div>;
  if (error) return <div style={styles.errorText}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Operator</th>
              <th style={styles.th}>Technology</th>
              <th style={styles.th}>MCC</th>
              <th style={styles.th}>MNC</th>
              <th style={styles.th}>TAC</th>
              <th style={styles.th}>CI</th>
              <th style={styles.th}>PCI</th>
              <th style={styles.th}>Frequency</th>
              <th style={styles.th}>Signal Power</th>
              <th style={styles.th}>Signal Quality</th>
              <th style={styles.th}>Last Update</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTowers.map((tower) => (
              <tr 
                key={tower.ci}
                style={{
                  ...styles.td,
                  ...(updatedTowers.has(tower.ci) ? styles.updatedRow : {})
                }}
              >
                <td style={styles.td}>{tower.operator_str}</td>
                <td style={styles.td}>{tower.rat}</td>
                <td style={styles.td}>{tower.mcc}</td>
                <td style={styles.td}>{tower.mnc}</td>
                <td style={styles.td}>{tower.tac}</td>
                <td style={styles.td}>{tower.ci}</td>
                <td style={styles.td}>{tower.pci}</td>
                <td style={styles.td}>{tower.freq}</td>
                <td style={styles.td}>{tower.signal_power} dBm</td>
                <td style={styles.td}>{tower.signal_quality} dB</td>
                <td style={styles.td}>{new Date(tower.timestamp).toLocaleString()}</td>
                <td style={styles.td}>
                  <button 
                    style={styles.button}
                    onClick={() => setSelectedTower(tower)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.filterContainer}>
        <div>
          <label style={styles.label}>Service Provider:</label>
          <div style={styles.checkboxGroup}>
            {operators.map(op => (
              <label key={op}>
                <input 
                  type="checkbox" 
                  name="operator" 
                  value={op} 
                  checked={filters.operator.includes(op)} 
                  onChange={(e) => handleFilterChange('operator', e.target.value)}
                />
                {op}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={styles.label}>Technology:</label>
          <div style={styles.checkboxGroup}>
            {technologies.map(tech => (
              <label key={tech}>
                <input 
                  type="checkbox" 
                  name="technology" 
                  value={tech} 
                  checked={filters.technology.includes(tech)} 
                  onChange={(e) => handleFilterChange('technology', e.target.value)}
                />
                {tech}
              </label>
            ))}
          </div>
        </div>
      </div>

      {selectedTower && (
        <TowerDetails
          tower={selectedTower}
          open={!!selectedTower}
          onClose={() => setSelectedTower(null)}
        />
      )}
    </div>
  );
}

export default Data;