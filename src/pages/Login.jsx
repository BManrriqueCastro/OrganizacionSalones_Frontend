import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/logoPIO.png";
import Modal from "../components/Modal";
import { FontAwesomeIcon, faLock, faUserGroup, faEnvelope } from '../components/icons';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [modal, setModal] = useState({
        show: false,
        message: "",
        type: "info",
    });
    const navigate = useNavigate();

    const showModal = (message, type = "info") => {
        setModal({ show: true, message, type });
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            showModal("Todos los campos son obligatorios", "error");
            return;
        }
        // Simulación: cambiar por petición real con fetch o axios
        if (email === "admin@pio.com" && password === "admin123") {
            navigate("/dashboard");
        } else {
            showModal("Credenciales incorrectas", "error");
        }
    };

    return (
        <main className="login-container">
            <Modal
                show={modal.show}
                message={modal.message}
                type={modal.type}
                onClose={() => {
                    setModal({ ...modal, show: false });

                    // Limpiar el formulario solo si fue un error de login
                    if (
                        modal.type === "error" &&
                        modal.message === "Credenciales incorrectas"
                    ) {
                        setEmail("");
                        setPassword("");
                    }
                }}
            />

            <section className="login-left">
                <img src={logo} alt="Logo PIO" className="logo" />
                <article>
                    <h1>¡BIENVENIDO!</h1>
                    <p>Inicia Sesión para administrar la organización de salones</p>
                    <span>
                        <FontAwesomeIcon icon={faUserGroup} />
                    </span>
                </article>
            </section>

            <section className="login-right">
                <form onSubmit={handleLogin} className="login-form">
                    <h2>INICIAR SESIÓN</h2>
                    <div className="input-group">
                        <span className="icon">
                            <FontAwesomeIcon icon={faEnvelope}/>
                        </span>
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <span className="icon">
                            <FontAwesomeIcon icon={faLock} />
                        </span>
                        <input
                            type="password"
                            placeholder="contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Iniciar
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Login;
