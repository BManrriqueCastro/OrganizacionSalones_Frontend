import React from 'react';
import '../styles/Modal.css';

const Modal = ({ show, onClose, onConfirm, message, type = 'info' }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className={`modal-box modal-${type}`}>
                <p>{message}</p>
                
                <div className="modal-buttons">
                    {type === 'confirm' ? (
                        <>
                            <button className="confirm-btn" onClick={onConfirm}>Sí</button>
                            <button className="cancel-btn" onClick={onClose}>No</button>
                        </>
                    ) : (
                        <button className="close-btn" onClick={onClose}>Cerrar</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;

