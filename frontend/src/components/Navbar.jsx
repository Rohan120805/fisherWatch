import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const styles = {
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
    textDecoration: 'none'
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    backgroundColor: '#2a2a2a',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#646cff',
      transform: 'translateY(-2px)'
    }
  },
  logoutButton: {
    color: '#fff',
    background: 'transparent',
    border: '1px solid #646cff',
    padding: '0.6rem 1.2rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#646cff',
      transform: 'translateY(-2px)'
    }
  }
};

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  useEffect(() => {
    // Check login status when component mounts
    checkLoginStatus();

    // Add event listener for auth changes
    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('auth-change', handleAuthChange);

    // Cleanup
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

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

  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
        <Link to="/">Fisher Watch</Link>
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