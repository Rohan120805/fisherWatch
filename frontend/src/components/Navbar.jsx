import { UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

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
  }
};

function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}><Link to="/">Fisher Watch</Link></div>
      <div style={styles.nav}>
        <Link to="/data" style={styles.link}>Data</Link>
        <Link to="/map" style={styles.link}>Map</Link>
        {/* <button onClick={onLogout}>Logout</button> */}
        <UserButton />
      </div>
    </nav>
  );
}

export default Navbar;