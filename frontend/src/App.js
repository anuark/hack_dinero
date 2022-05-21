import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Home from './views/Home/Home.js';
import Rescue from './views/Rescue/Rescue.js';
import Success from './views/Success/Success.js';
import Header from './views/Header.js';
import Footer from './views/Footer.js';
import './App.css';

function App() {
  const [provider, setProvider] = useState('');
  const [addr, setAddr] = useState(0);
  const [signer, setSigner] = useState({});

  return (
    <div className="App">
      <Header signer={signer} setSigner={setSigner} setProvider={setProvider} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/rescue"
          element={
            <Rescue
              signer={signer}
              setSigner={setSigner}
              addr={addr}
              setAddr={setAddr}
              provider={provider}
              setProvider={setProvider}
            />
          }
        />
        <Route path="/success" element={<Success />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
