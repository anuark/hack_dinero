import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './views/Home/Home.js';
import Rescue from './views/Rescue/Rescue.js';
import Success from './views/Success/Success.js';
import Header from './views/Header.js';
import Footer from './views/Footer.js';

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rescue" element={<Rescue />} />
                <Route path="/success" element={<Success />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
