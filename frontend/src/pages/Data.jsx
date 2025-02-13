import { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';

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
    overflow: 'auto',
    position: 'relative',
    maxHeight: 'calc(100vh - 96px)',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1a1a1a',
    borderSpacing: 0
  },
  th: {
    backgroundColor: '#2a2a2a',
    padding: '12px',
    textAlign: 'center',
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 2px -1px rgba(0, 0, 0, 0.4)'
  },
  td: {
    textAlign: 'center',
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottom: '1px solid #333',
    marginBottom: '1rem'
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
    background: 'none',
    border: 'none',
    color: '#ffffff80',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '0.5rem',
    marginTop: '-0.5rem',
    transition: 'color 0.2s',
    '&:hover': {
      color: '#fff'
    }
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem'
  },
  pcapContainer: {
    borderLeft: '2px solid #646cff',
    paddingLeft: '1rem',
    marginBottom: '1rem'
  },
  fingerprintInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  scoreColors: {
    zero: 'rgba(40, 167, 69, 0.3)',   // green
    middle: 'rgba(255, 85, 0, 0.3)',  // orange
    high: 'rgba(255, 0, 25, 0.3)',    // red
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
          <h2 style={{ margin: 0 }}>Tower Details</h2>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Basic Information Section */}
        <div style={styles.dialogSection}>
          <div style={styles.dialogSectionTitle}>Basic Information</div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Operator:</span>
            <span>{tower.operator_short_str || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Operator (Short):</span>
            <span>{tower.operator_short_str || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>RAT:</span>
            <span>{tower.rat || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Created:</span>
            <span>{tower.createdAt ? new Date(tower.createdAt).toLocaleString() : 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Last Updated:</span>
            <span>{tower.last_modified ? getRelativeTime(tower.last_modified) : 'N/A' }</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Kingfisher ID:</span>
            <span>{tower.kingfisher_id || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Kingfisher Version:</span>
            <span>{tower.kingfisher_version || 'N/A'}</span>
          </div>
          {tower.kingfisher_id_changed && (
            <div style={{...styles.dialogRow, color: '#ff4444'}}>
              <span style={styles.dialogLabel}>Warning:</span>
              <span>This tower was detected by a different Kingfisher device</span>
            </div>
          )}
        </div>

        {/* Network Information Section */}
        <div style={styles.dialogSection}>
          <div style={styles.dialogSectionTitle}>Network Information</div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>MCC:</span>
            <span>{tower.mcc || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>MNC:</span>
            <span>{tower.mnc || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>TAC:</span>
            <span>{tower.tac || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>CI:</span>
            <span>{tower.ci || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>PCI:</span>
            <span>{tower.pci || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Frequency:</span>
            <span>{tower.freq || 'N/A'}</span>
          </div>
        </div>

        {/* Signal Information Section */}
        <div style={styles.dialogSection}>
          <div style={styles.dialogSectionTitle}>Signal Information</div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Signal Power:</span>
            <span>{tower.signal_power+' dBm' || 'N/A'}</span>
          </div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Signal Quality:</span>
            <span>{tower.signal_quality+' dB' || 'N/A'}</span>
          </div>
        </div>

        {/* Fingerprints Section */}
        {tower.analysis_report?.fingerprints && tower.analysis_report.fingerprints.size > 0 && (
          <div style={styles.dialogSection}>
            <div style={styles.dialogSectionTitle}>Fingerprints</div>
            {Array.from(tower.analysis_report.fingerprints.entries()).map(([key, value]) => (
              <div key={key} style={styles.dialogRow}>
                <span style={styles.dialogLabel}>{key}:</span>
                <span>
                  Type: {value.type_ || 'N/A'}, 
                  Triggered: {value.times_triggered || 'N/A'}, 
                  Certainty: {value.certainty || 'N/A'}, 
                  Description: {value.description || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
}

function AnalysisReportDialog({ tower, open, onClose }) {
  if (!tower?.analysis_report) return null;
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ style: styles.dialog }}
    >
      <div style={styles.dialogContent}>
        <div style={styles.dialogTitle}>
          <h2 style={{ margin: 0 }}>Analysis Report</h2>
          <button 
            style={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Analysis Results */}
        <div style={styles.dialogSection}>
          <div style={styles.dialogSectionTitle}>Analysis Results</div>
          <div style={styles.dialogRow}>
            <span style={styles.dialogLabel}>Score:</span>
            <span>{tower.analysis_report.score || 'N/A'}</span>
          </div>
          {tower.analysis_report.distance_in_meters && (
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Distance:</span>
              <span>{tower.analysis_report.distance_in_meters || 'N/A'} meters</span>
            </div>
          )}
        </div>

        {/* GNSS Information */}
        {tower.analysis_report.pcaps?.[0]?.gnss_position && (
          <div style={styles.dialogSection}>
            <div style={styles.dialogSectionTitle}>GNSS Position</div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Latitude:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.latitude || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Longitude:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.longitude || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Fix:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.fix || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>UTC:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.utc || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>HDOP:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.hdop || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Altitude:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.altitude || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Course over Ground:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.cog || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Speed (km/h):</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.spkm || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Speed (knots):</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.spkn || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Date:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.date || 'N/A'}</span>
            </div>
            <div style={styles.dialogRow}>
              <span style={styles.dialogLabel}>Satellites:</span>
              <span>{tower.analysis_report.pcaps[0].gnss_position.nsat || 'N/A'}</span>
            </div>
          </div>
        )}

        {/* Fingerprints Section */}
        {tower.analysis_report.fingerprints && Object.keys(tower.analysis_report.fingerprints).length > 0 && (
          <div style={styles.dialogSection}>
            <div style={styles.dialogSectionTitle}>Fingerprints</div>
            {Object.entries(tower.analysis_report.fingerprints).map(([key, value]) => (
              <div key={key} style={styles.dialogRow}>
                <span style={styles.dialogLabel}>{key}:</span>
                <span style={styles.fingerprintInfo}>
                  <div>Type: {value.type_ || 'N/A'}</div>
                  <div>Triggered: {value.times_triggered || 'N/A'}</div>
                  <div>Certainty: {value.certainty || 'N/A'}</div>
                  <div>Description: {value.description || 'N/A'}</div>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* PCAP Information */}
        {tower.analysis_report.pcaps?.length > 0 && (
          <div style={styles.dialogSection}>
            <div style={styles.dialogSectionTitle}>PCAP Information</div>
            {tower.analysis_report.pcaps.map((pcap, index) => (
              <div key={index} style={styles.pcapContainer}>
                <div style={styles.dialogRow}>
                  <span style={styles.dialogLabel}>PCAP {index + 1} Path:</span>
                  <span>{pcap.path || 'N/A'}</span>
                </div>
                {pcap.gnss_position && (
                  <>
                    <div style={styles.dialogRow}>
                      <span style={styles.dialogLabel}>Location:</span>
                      <span>
                        Lat: {pcap.gnss_position.latitude || 'N/A'}, 
                        Lon: {pcap.gnss_position.longitude || 'N/A'}
                      </span>
                    </div>
                    <div style={styles.dialogRow}>
                      <span style={styles.dialogLabel}>Fix:</span>
                      <span>{pcap.gnss_position.fix || 'N/A'}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Dialog>
  );
}

function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // Convert milliseconds to different units
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (days < 30) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

function Data() {
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [towers, setTowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTower, setSelectedTower] = useState(null);
  const [filters, setFilters] = useState({
    operator: [],
    technology: [],
    score: [],
    timeRange: [],
  });
  const [updatedTowers, setUpdatedTowers] = useState(new Set());

  const operators = [...new Set(towers.map(tower => tower.operator_short_str))];
  const technologies = [...new Set(towers.map(tower => tower.rat))];
  const scoreRanges=[
    { label: 'N/A', value: 'null' },
    { label: 'Trusted', value: '0' },
    { label: 'Undecided', value: 'middle' },
    { label: 'Rogue', value: '100' }
  ]
  const timeRanges = [
    { label: '1 hour ago', value: '1h' },
    { label: '3 hours ago', value: '3h' },
    { label: '12 hours ago', value: '12h' },
    { label: '24 hours ago', value: '24h' },
    { label: 'More than 24 hours', value: 'older' }
  ];

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

  const isScoreInRange = (score, range) => {
    switch (range) {
      case 'null':
        return score === null;
      case '0':
        return score === 0;
      case 'middle':
        return score > 0 && score < 100;
      case '100':
        return score >= 100;
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

  if (loading) return <div style={styles.loadingText}>Loading tower data...</div>;
  if (error) return <div style={styles.errorText}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Operator</th>
              <th style={styles.th}>RAT</th>
              <th style={styles.th}>MCC</th>
              <th style={styles.th}>MNC</th>
              <th style={styles.th}>TAC/LAC</th>
              <th style={styles.th}>CI</th>
              <th style={styles.th}>PCI</th>
              <th style={styles.th}>Frequency</th>
              <th style={styles.th}>Signal Power</th>
              <th style={styles.th}>Signal Quality</th>
              <th style={styles.th}>Last Updated</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTowers.map((tower) => (
              <tr 
                key={tower.ci}
                style={{
                  ...styles.td,
                  ...(updatedTowers.has(tower.ci) ? styles.updatedRow : {}),
                  backgroundColor: tower.analysis_report?.score === null 
                  ? styles.scoreColors.zero
                  : tower.analysis_report?.score === 0
                  ? styles.scoreColors.zero
                  : tower.analysis_report?.score === 100
                  ? styles.scoreColors.high
                  : styles.scoreColors.middle
              }}
              >
                <td style={styles.td}>{tower.operator_short_str || 'Null'}</td>
                <td style={styles.td}>{tower.rat || 'Null'}</td>
                <td style={styles.td}>{tower.mcc || 'Null'}</td>
                <td style={styles.td}>{tower.mnc || 'Null'}</td>
                <td style={styles.td}>{tower.tac || tower.lac || 'Null'}</td>
                <td style={styles.td}>{tower.ci || 'Null'}</td>
                <td style={styles.td}>{tower.pci || 'N/A'}</td>
                <td style={styles.td}>{tower.freq || 'Null'}</td>
                <td style={styles.td}>{tower.signal_power || 'Null'}</td>
                <td style={styles.td}>{tower.signal_quality || 'Null'}</td>
                <td style={styles.td}>
                  {tower.last_modified 
                    ? getRelativeTime(tower.last_modified)
                    : getRelativeTime(tower.updatedAt)
                  }
                </td>
                <td style={styles.td}>
                  <div style={styles.buttonGroup}>
                    <button 
                      style={styles.button}
                      onClick={() => setSelectedTower(tower)}
                    >
                      Details
                    </button>
                    <button 
                      style={styles.button}
                      onClick={() => {
                        setSelectedAnalysis(tower);
                        setShowAnalysisReport(true);
                      }}
                      disabled={!tower.analysis_report}
                    >
                      Analysis
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <label style={styles.label}>Network Generation:</label>
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

        <div>
          <label style={styles.label}>Tower Listed As:</label>
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
          <label style={styles.label}>Last Updated:</label>
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

      {selectedTower && (
        <TowerDetails
          tower={selectedTower}
          open={!!selectedTower}
          onClose={() => setSelectedTower(null)}
        />
      )}
      {selectedAnalysis && (
        <AnalysisReportDialog
          tower={selectedAnalysis}
          open={showAnalysisReport}
          onClose={() => {
            setShowAnalysisReport(false);
            setSelectedAnalysis(null);
          }}
        />
      )}
    </div>
  );
}

export default Data;