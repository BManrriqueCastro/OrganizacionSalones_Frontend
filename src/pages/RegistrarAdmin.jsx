import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import '../styles/RegistrarAdmin.css';

function RegistrarAdmin() {
    // Estado para manejar los datos del formulario
    //
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contraseña: '',
        confirmacion: '',
    });

    const [modal, setModal] = useState({
        show: false,
        message: '',
        type: 'info',
    });

    const handleCloseModal = () => {
        setModal({ ...modal, show: false });
    };

    const validarNombre = (nombre) => {
        // Contar letras únicas (ignorando espacios y mayúsculas)
        const letrasUnicas = new Set(nombre.toLowerCase().replace(/[^a-záéíóúüñ]/gi, ''));
        return letrasUnicas.size >= 3;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que el nombre tenga al menos tres letras diferentes
        if (!validarNombre(formData.nombre)) {
            setModal({
                show: true,
                message: 'El nombre debe contener al menos tres letras diferentes.',
                type: 'info',
            });
            return;
        }

        // Validar que el correo termine en @pio.com
        const correoValido = formData.correo.endsWith('@pio.com');
        if (!correoValido) {
            setModal({
                show: true,
                message: 'El correo debe terminar en @pio.com',
                type: 'info',
            });
            return;
        }

        // Aquí continúa el envío si pasa la validación
        console.log("Formulario válido:", formData);

        if (formData.contraseña !== formData.confirmacion) {
            setModal({
                show: true,
                message: 'Las contraseñas no coinciden.',
                type: 'info',
            });
            return;
        }

        // Aquí iría la lógica para enviar los datos al backend
        
        setModal({
            show: true,
            message: 'Administrador registrado con éxito.',
            type: 'info',
        });

        // Reiniciar el formulario si lo deseas
        setFormData({
            nombre: '',
            correo: '',
            contraseña: '',
            confirmacion: '',
        });
    };

    return (
        <div>
            <Header />
            <div className='registrar-admin-container'>
                <h2 className="titulo-registrar">Registro de nuevo Administrador</h2>

                <form className="formulario-registro" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Correo"
                        value={formData.correo}
                        onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={formData.contraseña}
                        onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={formData.confirmacion}
                        onChange={(e) => setFormData({ ...formData, confirmacion: e.target.value })}
                        required
                    />
                    <button type="submit" className="boton-registrar">Registrar</button>
                </form>

                <Modal
                    show={modal.show}
                    onClose={handleCloseModal}
                    message={modal.message}
                    type={modal.type}
                />
            </div>
        </div>
    );
}

export default RegistrarAdmin;

