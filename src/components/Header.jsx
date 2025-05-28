import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/LogoPIO.png';
import "../styles/Header.css";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        navigate('/');
    };

    const showBackToDashboard = location.pathname !== '/dashboard';

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <header>
            <img src={logo} alt="Instituto PIO" />
            <div className="header-buttons">
                {showBackToDashboard && (
                    <button className="back-button" onClick={handleBackToDashboard}>
                        Volver al Dashboard
                    </button>
                )}
                <button className='logout-button' onClick={handleLogout}>Cerrar sesión</button>
            </div>
        </header>
    );
}

export default Header;
