import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import '../styles/Cursos.css';

function Cursos() {
    // Estado para manejar los cursos
    // y el formulario de creación/edición
    //cambiar por datos reales desde el backend con su respectiva llamada a la API del backend
    const [cursos, setCursos] = useState([
        { id: 1, nombre: 'Matemáticas', cantidad: 22 },
        { id: 2, nombre: 'Inglés', cantidad: 20 },
        { id: 3, nombre: 'Álgebra', cantidad: 30 },
        { id: 4, nombre: 'Marketing', cantidad: 40 },
    ]);

    const [nuevoCurso, setNuevoCurso] = useState({ nombre: '', cantidad: '' }); // Estado para el formulario de curso
    const [editandoId, setEditandoId] = useState(null); // Estado para manejar la edición de un curso
    const [formVisible, setFormVisible] = useState(false);  // Estado para mostrar/ocultar el formulario
    const [modal, setModal] = useState({ show: false, message: '', type: 'info' }); // Estado para manejar el modal
    const [cursoAEliminar, setCursoAEliminar] = useState(null); // Estado para manejar la eliminación de un curso

    // Funciones para manejar el formulario y la lógica de los cursos
    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevoCurso({ ...nuevoCurso, [name]: value });
    };

    const mostrarModal = (message, type = 'info') => {
        setModal({ show: true, message, type });
    };

    const cerrarModal = () => {
        setModal({ show: false, message: '', type: 'info' });
    };
    // Validación del formulario de curso
    const validarCurso = () => {
        const { nombre, cantidad } = nuevoCurso;
        const letras = nombre.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const letrasUnicas = new Set(letras);
        if (!nombre || !cantidad) return 'Todos los campos son obligatorios.';
        if (letrasUnicas.size < 3) return 'El nombre debe tener al menos 3 letras diferentes.';
        if (!/^\d+$/.test(cantidad) || parseInt(cantidad) <= 0) return 'La cantidad debe ser un número entero positivo.';
        const nombreExiste = cursos.some((c) => c.nombre.toLowerCase() === nombre.toLowerCase() && c.id !== editandoId);
        if (nombreExiste) return 'Ya existe un curso con ese nombre.';
        return null;
    };
    // Funciones para agregar, editar y eliminar cursos
    const agregarCurso = () => {
        const error = validarCurso();
        if (error) return mostrarModal(error, 'error');
        const nuevo = { ...nuevoCurso, id: Date.now(), cantidad: parseInt(nuevoCurso.cantidad) };
        setCursos([...cursos, nuevo]);
        resetFormulario();
    };

    const editarCurso = (curso) => {
        setEditandoId(curso.id);
        setNuevoCurso({ nombre: curso.nombre, cantidad: curso.cantidad });
        setFormVisible(true);
    };

    const guardarCurso = () => {
        const error = validarCurso();
        if (error) return mostrarModal(error, 'error');
        setCursos(cursos.map(c =>
            c.id === editandoId ? { ...c, nombre: nuevoCurso.nombre, cantidad: parseInt(nuevoCurso.cantidad) } : c
        ));
        resetFormulario();
    };

    const cancelarEdicion = () => {
        resetFormulario();
    };

    const resetFormulario = () => {
        setNuevoCurso({ nombre: '', cantidad: '' });
        setEditandoId(null);
        setFormVisible(false);
    };

    const confirmarEliminacion = (id) => {
        setCursoAEliminar(id);
        setModal({
            show: true,
            message: '¿Estás seguro que deseas eliminar este curso?',
            type: 'confirm',
        });
    };

    const eliminarCurso = () => {
        setCursos(cursos.filter((c) => c.id !== cursoAEliminar));
        setCursoAEliminar(null);
        cerrarModal();
    };

    return (
        <div>
            <Header />
            <div className="contenedor-cursos">
                <h2>Gestión de cursos</h2>

                {!formVisible && (
                    <button className="btn-agregar" onClick={() => setFormVisible(true)}>
                        Agregar curso
                    </button>
                )}

                {formVisible && (
                    <div className="formulario-curso">
                        <div className="campos-formulario">
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="nombre"
                                value={nuevoCurso.nombre}
                                onChange={manejarCambio}
                            />
                            <input
                                type="number"
                                placeholder="Cantidad Max"
                                name="cantidad"
                                value={nuevoCurso.cantidad}
                                onChange={manejarCambio}
                            />
                        </div>
                        <div className="botones-formulario">
                            <button className="btn-guardar" onClick={editandoId ? guardarCurso : agregarCurso}>
                                Guardar
                            </button>
                            <button className="btn-cancelar" onClick={cancelarEdicion}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <div className="tabla-cursos">
                    <div className="tabla-encabezado">
                        <span>CURSOS</span>
                        <span>CANT. ESTUDIANTES</span>
                        <span>MODIFICACIÓN</span>
                    </div>
                    {cursos.map((curso) => (
                        <div className="tabla-fila" key={curso.id}>
                            <span>{curso.nombre}</span>
                            <span>{curso.cantidad}</span>
                            <span className="acciones">
                                <button className="btn-editar" onClick={() => editarCurso(curso)}>Editar</button>
                                <button className="btn-eliminar" onClick={() => confirmarEliminacion(curso.id)}>Eliminar</button>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                show={modal.show}
                type={modal.type}
                message={modal.message}
                onClose={cerrarModal}
                onConfirm={eliminarCurso}
            />
        </div>
    );
}

export default Cursos;