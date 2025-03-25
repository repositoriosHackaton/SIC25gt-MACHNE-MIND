import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import YearlyCrypto from './pages/YearlyCryptos';
import TopCryptos from './pages/TopCryptos';
import Stats from './pages/Stats';
import CryptoDetail from './pages/CryptoDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/yearly-cryptos" element={<YearlyCrypto />} />
          <Route path="/top-cryptos" element={<TopCryptos />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/crypto-detail" element={<CryptoDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
