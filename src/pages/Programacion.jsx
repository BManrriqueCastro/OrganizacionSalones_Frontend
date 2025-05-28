import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import '../styles/Programacion.css';

function Programacion() {
    // Estado para manejar las programaciones
    //cambiar por datos reales desde el backend con su respectiva llamada a la API del backend
    const [programaciones, setProgramaciones] = useState([
        {
            id: 1,
            sede: 'Sur',
            salon: 'Salón 1',
            curso: 'Matemáticas',
            fecha: '2025-05-28',
            diaNombre: 'miércoles',
            horaInicio: '09:00',
            horaFin: '12:00',
        },
        {
            id: 2,
            sede: 'Norte',
            salon: 'Salón 2',
            curso: 'Física',
            fecha: '2025-05-29',
            diaNombre: 'jueves',
            horaInicio: '10:00',
            horaFin: '13:00',
        },
    ]);

    const [formulario, setFormulario] = useState({
        sede: '',
        salon: '',
        curso: '',
        fecha: '',
        horaInicio: '',
        horaFin: ''
    });

    const [editandoId, setEditandoId] = useState(null);

    const [modal, setModal] = useState({
        visible: false,
        mensaje: '',
        tipo: 'info',
        onConfirmar: null,
        onCancelar: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    };

    const verificarSolapamiento = () => {
        return programaciones.some((prog) =>
            prog.id !== editandoId &&
            prog.sede === formulario.sede &&
            prog.salon === formulario.salon &&
            prog.fecha === formulario.fecha &&
            (
                (formulario.horaInicio >= prog.horaInicio && formulario.horaInicio < prog.horaFin) ||
                (formulario.horaFin > prog.horaInicio && formulario.horaFin <= prog.horaFin) ||
                (formulario.horaInicio <= prog.horaInicio && formulario.horaFin >= prog.horaFin)
            )
        );
    };

    const handleGuardar = () => {
        const campos = ['sede', 'salon', 'curso', 'fecha', 'horaInicio', 'horaFin'];
        const vacios = campos.some(campo => !formulario[campo]);

        if (vacios) {
            setModal({
                visible: true,
                mensaje: "Por favor, completa todos los campos.",
                tipo: 'info',
                onConfirmar: () => setModal({ ...modal, visible: false }),
            });
            return;
        }

        if (verificarSolapamiento()) {
            setModal({
                visible: true,
                mensaje: "Este salón ya tiene una programación en ese horario. Por favor, elige otra fecha u horario.",
                tipo: 'info',
                onConfirmar: () => setModal({ ...modal, visible: false }),
            });
            return;
        }

        const fechaObj = new Date(formulario.fecha + 'T00:00');
        const diaNombre = fechaObj.toLocaleDateString('es-ES', { weekday: 'long' });

        if (editandoId !== null) {
            const nuevas = programaciones.map((prog) =>
                prog.id === editandoId ? { ...prog, ...formulario, diaNombre } : prog
            );
            setProgramaciones(nuevas);
            setEditandoId(null);
        } else {
            const nueva = {
                id: Date.now(),
                ...formulario,
                diaNombre
            };
            setProgramaciones([...programaciones, nueva]);
        }

        setFormulario({
            sede: '',
            salon: '',
            curso: '',
            fecha: '',
            horaInicio: '',
            horaFin: ''
        });
    };

    const handleEditar = (prog) => {
        setFormulario({ ...prog });
        setEditandoId(prog.id);
    };

    const handleEliminar = (id) => {
        setModal({
            visible: true,
            mensaje: "¿Seguro que quieres eliminar esta programación?",
            tipo: 'confirm',
            onConfirmar: () => {
                setProgramaciones((prev) => prev.filter((prog) => prog.id !== id));
                setModal({ ...modal, visible: false });
            },
            onCancelar: () => setModal({ ...modal, visible: false }),
        });
    };

    return (
        <div>
            <Header />
            <div className="programacion-container">
                <h2 className="titulo">Programación de Cursos</h2>

                <div className="formulario-curso">
                    <select name="sede" value={formulario.sede} onChange={handleChange}>
                        <option value="">Sede</option>
                        <option value="Sur">Sur</option>
                        <option value="Norte">Norte</option>
                    </select>

                    <select name="salon" value={formulario.salon} onChange={handleChange}>
                        <option value="">Salones</option>
                        <option value="Salón 1">Salón 1</option>
                        <option value="Salón 2">Salón 2</option>
                        <option value="Salón 3">Salón 3</option>
                    </select>

                    <select name="curso" value={formulario.curso} onChange={handleChange}>
                        <option value="">Cursos</option>
                        <option value="Matemáticas">Matemáticas</option>
                        <option value="Física">Física</option>
                        <option value="Química">Química</option>
                    </select>

                    <div className="horas">
                        <div>
                            <label>Fecha</label>
                            <input type="date" name="fecha" value={formulario.fecha} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Hora inicio</label>
                            <input type="time" name="horaInicio" value={formulario.horaInicio} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Hora final</label>
                            <input type="time" name="horaFin" value={formulario.horaFin} onChange={handleChange} />
                        </div>
                    </div>

                    <button className="btn-guardar" onClick={handleGuardar}>
                        {editandoId !== null ? 'Actualizar Programación' : 'Agregar Programación'}
                    </button>
                </div>

                <div className="listado-programacion">
                    {programaciones.map((prog) => (
                        <div key={prog.id} className="card-programacion">
                            <h3>{prog.curso} en {prog.salon} ({prog.sede})</h3>
                            <p>Fecha: {prog.fecha} ({prog.diaNombre})</p>
                            <p>Hora: {prog.horaInicio} - {prog.horaFin}</p>
                            <div className="acciones">
                                <button className="btn-editar" onClick={() => handleEditar(prog)}>Editar</button>
                                <button className="btn-eliminar" onClick={() => handleEliminar(prog.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>

                {modal.visible && (
                    <Modal
                        show={modal.visible}
                        message={modal.mensaje}
                        type={modal.tipo}
                        onConfirm={modal.onConfirmar}
                        onClose={modal.onCancelar || modal.onConfirmar}
                    />
                )}
            </div>
        </div>
    );
}

export default Programacion;
