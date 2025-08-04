import React from 'react';

const Footer = ({ visible }) => {
    return (
        <footer className={`footer mt-auto py-3 bg-light border-top text-center text-muted ${visible ? 'show' : ''}`}>
            <div className="container">
                <small>&copy; 2024 React Film Search. All rights reserved.</small>
            </div>
        </footer>
    );
};

export default Footer;
