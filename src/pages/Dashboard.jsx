import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import "../styles/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const isSuperAdmin = true;  // Simulación de rol, cambiarlo por lógica real desde el backend

    return (
        <div>
            <Header />
            <div className="dashboard-container">
                <h2>Bienvenido [Admin]</h2>
                <button onClick={() => navigate('/salones')}>Ver Salones</button>
                <button onClick={() => navigate('/cursos')}>Ver Cursos</button>
                <button onClick={() => navigate('/programacion')}>Ver Programación</button>
                {isSuperAdmin && (
                    <button onClick={() => navigate('/registrar-admin')}>Registrar Nuevo Admin</button>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
