import React, { useState } from 'react';
import Header from '../components/Header';
import Modal from '../components/Modal';
import '../styles/Salones.css';

function Salones() {
    // Estados para manejar los salones, sede seleccionada, formulario y modal
    // Simulación de datos iniciales
    //cambiar por datos reales desde el backend
    const [salones, setSalones] = useState([
        { id: 1, nombre: 'Salón 1', sede: 'Sur', capacidad: 30, inventario: ['TV', 'bocinas'] },
        { id: 2, nombre: 'Salón 2', sede: 'Norte', capacidad: 25, inventario: ['proyector'] },
    ]);
    const [sedeSeleccionada, setSedeSeleccionada] = useState(''); // Sede seleccionada para filtrar los salones
    const [mostrarFormulario, setMostrarFormulario] = useState(false); // Controla la visibilidad del formulario de creación/edición
    const [nuevoSalon, setNuevoSalon] = useState({ nombre: '', sede: '', capacidad: '', inventario: '' }); // Datos del nuevo salón a agregar o editar
    const [modoEdicion, setModoEdicion] = useState(null); // ID del salón que se está editando, null si no hay edición en curso
    const [modal, setModal] = useState({ show: false, message: '', type: 'info' });
    const [salonAEliminar, setSalonAEliminar] = useState(null); // Salón que se está confirmando para eliminar

    const inventarioValido = ['tv', 'bocinas', 'proyector'];    //cambiar por datos reales desde el backend

    // Funciones para manejar el formulario y la lógica de los salones
    const limpiarCampos = () => {
        setNuevoSalon({ nombre: '', sede: '', capacidad: '', inventario: '' });
        setModoEdicion(null);
        setMostrarFormulario(false);
    };
    // Función para mostrar el modal con un mensaje y tipo específico
    const mostrarModal = (message, type = 'error') => {
        setModal({ show: true, message, type });
    };

    const cerrarModal = () => {
        setModal({ show: false, message: '', type: 'info' });
    };
    // Función para agregar un nuevo salón
    // o para editar uno existente
    const handleAgregarSalon = () => {
        limpiarCampos();
        setMostrarFormulario(true);
    };
    // Función para validar los campos del formulario
    // y asegurarse de que cumplen con las reglas establecidas
    const validarCampos = () => {
        const { nombre, sede, capacidad, inventario } = nuevoSalon;
        if (!nombre.trim() || !sede.trim() || !capacidad.trim() || !inventario.trim()) {
            return 'Todos los campos son obligatorios.';
        }

        const sedeValida = ['sur', 'norte'];
        if (!sedeValida.includes(sede.trim().toLowerCase())) {
            return 'La sede debe ser "Sur" o "Norte".';
        }

        const letras = nombre.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const letrasUnicas = new Set(letras.split(''));
        if (letrasUnicas.size < 3) {
            return 'El nombre debe tener al menos 3 letras diferentes.';
        }

        if (!/^\d+$/.test(capacidad) || parseInt(capacidad, 10) <= 0) {
            return 'La capacidad debe ser un número entero positivo.';
        }

        const tieneComa = inventario.includes(',');
        const items = inventario.split(',').map(i => i.trim().toLowerCase());
        const invalidos = items.filter(i => !inventarioValido.includes(i));

        if (items.length > 1 && !tieneComa) {
            return 'Se deben separar los elementos del inventario con comas.';
        }

        if (invalidos.length > 0) {
            return `Inventario inválido: ${invalidos.join(', ')}`;
        }

        const nombreExiste = salones.some(
            s => s.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() && s.id !== modoEdicion
        );
        if (nombreExiste) {
            return 'Ya existe un salón con ese nombre.';
        }

        return '';
    };
    // Función para guardar un salón nuevo o editado
    const handleGuardar = () => {
        const validacion = validarCampos();
        if (validacion) {
            mostrarModal(validacion, 'error');
            return;
        }

        const nuevo = {
            ...nuevoSalon,
            sede: nuevoSalon.sede.charAt(0).toUpperCase() + nuevoSalon.sede.slice(1).toLowerCase(),
            capacidad: parseInt(nuevoSalon.capacidad, 10),
            inventario: nuevoSalon.inventario.split(',').map(i => i.trim()),
        };

        if (modoEdicion !== null) {
            const actualizados = salones.map(salon =>
                salon.id === modoEdicion ? { ...salon, ...nuevo } : salon
            );
            setSalones(actualizados);
        } else {
            const nuevoId = salones.length > 0 ? Math.max(...salones.map(s => s.id)) + 1 : 1;
            setSalones([...salones, { id: nuevoId, ...nuevo }]);
        }

        limpiarCampos();
    };
    // Función para editar un salón existente
    const handleEditar = (salon) => {
        setNuevoSalon({
            nombre: salon.nombre,
            sede: salon.sede,
            capacidad: salon.capacidad.toString(),
            inventario: salon.inventario.join(', '),
        });
        setModoEdicion(salon.id);
        setMostrarFormulario(true);
    };

    const handleCancelar = () => {
        limpiarCampos();
    };
    // Función para confirmar la eliminación de un salón
    const confirmarEliminar = (salon) => {
        setSalonAEliminar(salon);
        setModal({
            show: true,
            message: `¿Estás seguro de que deseas eliminar el salón "${salon.nombre}"?`,
            type: 'confirm',
        });
    };
    // Función para manejar la confirmación de eliminación
    const handleEliminarConfirmado = () => {
        if (salonAEliminar) {
            setSalones(salones.filter(s => s.id !== salonAEliminar.id));
            setSalonAEliminar(null);
        }
        cerrarModal();
    };
    // Filtrar los salones según la sede seleccionada
    const salonesFiltrados = sedeSeleccionada
        ? salones.filter(s => s.sede.toLowerCase() === sedeSeleccionada.toLowerCase())
        : salones;

    return (
        <div>
            <Header />
            <div className="salones-container">
                <h2 className="titulo">Gestión de Salones</h2>

                <div className="acciones">
                    <select
                        value={sedeSeleccionada}
                        onChange={(e) => setSedeSeleccionada(e.target.value)}
                        className="selector-sede"
                    >
                        <option value="">Selecciona la sede</option>
                        <option value="Sur">Sur</option>
                        <option value="Norte">Norte</option>
                    </select>
                    {!mostrarFormulario && (
                        <button onClick={handleAgregarSalon} className="btn agregar">Agregar salón</button>
                    )}
                </div>

                {mostrarFormulario && (
                    <>
                        <div className="formulario">
                            <input
                                placeholder="Sede"
                                value={nuevoSalon.sede}
                                onChange={(e) => setNuevoSalon({ ...nuevoSalon, sede: e.target.value })}
                                className="campo"
                            />
                            <input
                                placeholder="Nombre"
                                value={nuevoSalon.nombre}
                                onChange={(e) => setNuevoSalon({ ...nuevoSalon, nombre: e.target.value })}
                                className="campo"
                            />
                            <input
                                placeholder="Capacidad"
                                value={nuevoSalon.capacidad}
                                onChange={(e) => setNuevoSalon({ ...nuevoSalon, capacidad: e.target.value })}
                                className="campo"
                            />
                            <input
                                placeholder="Inventario"
                                value={nuevoSalon.inventario}
                                onChange={(e) => setNuevoSalon({ ...nuevoSalon, inventario: e.target.value })}
                                className="campo"
                            />
                        </div>

                        <div className="acciones">
                            <button onClick={handleGuardar} className="btn guardar">Guardar</button>
                            <button onClick={handleCancelar} className="btn cancelar">Cancelar</button>
                        </div>
                    </>
                )}

                <div className="tabla-container">
                    <div className="fila encabezado">
                        <div>SALONES</div>
                        <div>CAPACIDAD</div>
                        <div>INVENTARIO</div>
                        <div>MODIFICACIÓN</div>
                    </div>
                    {salonesFiltrados.map((salon) => (
                        <div key={salon.id} className="fila datos">
                            <div>{salon.nombre}</div>
                            <div>{salon.capacidad}</div>
                            <div>{salon.inventario.join(', ')}</div>
                            <div className="acciones-fila">
                                {modoEdicion === salon.id ? (
                                    <>
                                        <button onClick={handleGuardar} className="btn guardar">Guardar</button>
                                        <button onClick={handleCancelar} className="btn cancelar">Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEditar(salon)} className="btn editar">Editar</button>
                                        <button onClick={() => confirmarEliminar(salon)} className="btn eliminar">Eliminar</button>

                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <Modal
                    show={modal.show}
                    onClose={cerrarModal}
                    onConfirm={handleEliminarConfirmado}
                    message={modal.message}
                    type={modal.type}
                />
            </div>
        </div>
    );
}

export default Salones;
