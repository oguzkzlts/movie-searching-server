import React from 'react';

const Footer = ({ visible }) => {
    return (
        <footer className={`footer text-center text-muted ${visible ? 'show' : ''}`}>
            <div className="container">
                <small style={{ margin: 0, padding: 0, display: 'inline-block' }}>
                    &copy; 2024 React Film Search. All rights reserved.
                </small>
            </div>
        </footer>
    );
};

export default Footer;
