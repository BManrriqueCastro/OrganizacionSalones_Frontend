import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Salones from './pages/Salones';
import Cursos from './pages/Cursos';
import Programacion from './pages/Programacion';
import RegistrarAdmin from './pages/RegistrarAdmin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/salones" element={<Salones />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/programacion" element={<Programacion />} />
        <Route path="/registrar-admin" element={<RegistrarAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;

