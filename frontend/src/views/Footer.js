import React from 'react';

const Footer = () => {
    return (
        <footer className="text-center text-white mt-auto" style={{"backgroundColor": "#21081a"}}>
            <div className="container p-4"></div>
            <div className="text-center p-3" style={{"backgroundColor": "rgba(0, 0, 0, 0.2)"}}>
                © 2022 Copyright:
                <p className="text-white">EOA Watch</p>
            </div>
        </footer>
    );
};

export default Footer;
