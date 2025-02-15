import Navbar from '../components/Navbar.jsx';

const styles = {
  home: {
    width: '100%',
    minHeight: '100vh',
  },
  content: {
    marginTop: '4rem',
    padding: '2rem',
  }
};

const textStyle = {
  textAlign: 'center',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const appContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  gap: '20px',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 0,
  padding: 0
};

const contentContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px'
};

function Home() {
  return (
    <div style={appContainerStyle}>
      <div style={contentContainerStyle}>
      <Navbar />
      <h1 style={textStyle}>Welcome to Fisher Watch.<br></br>A place where the Towers are watched.</h1>
      <div style={styles.content}>
      </div>
    </div>
    </div>
  );
}

export default Home;