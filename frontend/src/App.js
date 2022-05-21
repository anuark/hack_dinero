import { Routes, Route } from 'react-router-dom';
import React from 'react';

import WalletProvider from './providers/Wallet';
import Home from './views/Home/Home.js';
import Rescue from './views/Rescue/Rescue.js';
import Success from './views/Success/Success.js';
import Header from './views/Header.js';
import Footer from './views/Footer.js';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/rescue" element={<Rescue />} />
          <Route path="/success" element={<Success />} />
        </Routes>
        <Footer />
      </div>
    </WalletProvider>
  );
}

export default App;
