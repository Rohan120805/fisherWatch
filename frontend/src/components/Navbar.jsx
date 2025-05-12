import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

const styles = {
  alertBar: {
    backgroundColor: '#ff4444',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 1rem',
    whiteSpace: 'nowrap',
    animation: 'scroll-left 20s linear infinite'
  },
  warningDot: {
    width: '8px',
    height: '8px',
    backgroundColor: 'white',
    borderRadius: '50%',
    animation: 'pulse 1.5s infinite'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a1a1a',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    boxSizing: 'border-box'
  },
  brand: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#646cff',
    textDecoration: 'none',
    flex: '1'
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flex: '1',
    justifyContent: 'flex-end'
  },
  center: {
    flex: '2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    backgroundColor: '#2a2a2a',
    transition: 'all 0.2s ease'
  },
  logoutButton: {
    color: '#fff',
    background: 'transparent',
    border: '1px solid #646cff',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rogueTowers, setRogueTowers] = useState(0);
  const [lastDetection, setLastDetection] = useState(null);
  const navigate = useNavigate();

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/api/users/check-auth', {
        credentials: 'include'
      });
      setIsLoggedIn(response.ok);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const fetchRogueTowerCount = async () => {
    try {
      const response = await fetch('/api/towers', {
        credentials: 'include'
      });
      if (response.ok) {
        const towers = await response.json();
        const latestTimestamp = Math.max(...towers.map(t => 
          new Date(t.last_modified || t.updatedAt).getTime()
        ));
        const rogueTowers = towers.filter(tower => 
          tower.analysis_report?.score === 100 && 
          new Date(tower.last_modified || tower.updatedAt).getTime() === latestTimestamp
        );

        setRogueTowers(rogueTowers.length);
        if (rogueTowers.length > 0) {
          setLastDetection(new Date(latestTimestamp));
        }
      }
    } catch (error) {
      console.error('Failed to fetch tower data:', error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
    const handleAuthChange = () => {
      checkLoginStatus();
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRogueTowerCount();
      const interval = setInterval(fetchRogueTowerCount, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setIsLoggedIn(false);
        window.dispatchEvent(new Event('auth-change'));
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatDetectionTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
        <Link to="/">Fisher Watch</Link>
      </div>
      <div style={styles.center}>
        {isLoggedIn && rogueTowers > 0 && (
          <div style={styles.alertBar}>
            <div style={styles.warningDot}></div>
            {rogueTowers} rogue tower{rogueTowers !== 1 ? 's' : ''} detected in last scan which was {formatDetectionTime(lastDetection)}
          </div>
        )}
      </div>
      <div style={styles.nav}>
        {isLoggedIn ? (
          <>
            <Link to="/data" style={styles.link}>Data</Link>
            <Link to="/map" style={styles.link}>Map</Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;