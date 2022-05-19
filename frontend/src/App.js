import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './views/Home/Home.js';
import Header from './views/Header.js';
import Rescue from './views/Rescue/Rescue.js';
import Footer from './views/Footer.js';

function App() {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rescue" element={<Rescue />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
