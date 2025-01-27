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

function Home() {
  return (
    <div style={styles.home}>
      <Navbar />
      <div style={styles.content}>
        {/* <h1>Welcome to Fisher Watch</h1> */}
        {/* Add more content here */}
      </div>
    </div>
  );
}

export default Home;