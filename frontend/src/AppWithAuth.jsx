import { ClerkProvider, SignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Data from './pages/Data.jsx';
import Map from './pages/Map.jsx';
import Navbar from './components/Navbar.jsx';
import Globe from './components/Globe';
import { alignProperty } from '@mui/material/styles/cssUtils.js';

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const signInContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  maxHeight: '100vh',
  maxWidth: '100%',
  margin: '0 auto',
  padding: '10px',
  boxSizing: 'border-box',
  width: '100%'
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

function Hi() {
  return <h2 style={{ 
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }}></h2>;
}

function App() {
  return (
    <>
    <Globe/>
    <div style={appContainerStyle}>
      <div style={contentContainerStyle}>
        <ClerkProvider publishableKey={clerkFrontendApi}>
          <SignedOut>
          <Hi />
          <h1 style={textStyle}>Welcome to Fisher Watch.<br></br>A place where the Towers are watched.</h1>
          <Hi/>
          <div style={signInContainerStyle}>
            <SignIn />
          </div>
          </SignedOut>
          <SignedIn>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/data" element={<Data />} />
                <Route path="/map" element={<Map />} />
              </Routes>
            </BrowserRouter>
          </SignedIn>
        </ClerkProvider>
      </div>
    </div>
    </>
  );
}

export default App;