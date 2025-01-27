import { UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#1a1a1a',
    width: '99%',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    backgroundColor: '#2a2a2a'
  }
};

function Navbar() {
  return (
    <nav style={styles.navbar}>
      {/* <div style={styles.brand}>Fisher Watch</div> */}
      <div style={styles.brand}><Link to="/">Fisher Watch</Link></div>
      <div style={styles.nav}>
        <Link to="/data" style={styles.link}>Data</Link>
        <Link to="/map" style={styles.link}>Map</Link>
        <UserButton />
      </div>
    </nav>
  );
}

export default Navbar;