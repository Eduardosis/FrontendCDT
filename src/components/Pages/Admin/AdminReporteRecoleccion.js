import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Css/AdminReporteRecoleccion.css';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RegistrarRecoleccion = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [paqueteria, setPaqueteria] = useState('');
  const [ordenEnvio, setOrdenEnvio] = useState('');
  const [paqueterias, setPaqueterias] = useState([]);
  const [ordenesEnvio, setOrdenesEnvio] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener opciones de paquetería y orden de envío desde la API
    axios.get('http://127.0.0.1:8000/api/ee-serviciopaqueteria/')
      .then(response => setPaqueterias(response.data))
      .catch(error => console.error('Error al obtener las paqueterías:', error));

    axios.get('http://127.0.0.1:8000/api/p-ordenenvio/')
      .then(response => setOrdenesEnvio(response.data))
      .catch(error => console.error('Error al obtener las órdenes de envío:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!paqueteria) {
      alert('Por favor, selecciona una paquetería.');
      return;
    }
    if (!ordenEnvio) {
      alert('Por favor, selecciona una orden de envío.');
      return;
    }
    const nuevoReporte = {
      fecha,
      hora,
      paqueteria: parseInt(paqueteria, 10), // Asegurar que el ID de paquetería sea un número entero
      ordenenvio: parseInt(ordenEnvio, 10), // Asegurar que el ID de orden de envío sea un número entero
    };

    console.log('Datos enviados:', nuevoReporte); // Verifica que los datos sean correctos

    axios.post('http://127.0.0.1:8000/api/agr-reporte-recoleccion/', nuevoReporte)
      .then(response => {
        console.log('Reporte de recolección registrado:', response.data);
        alert('Reporte de recolección registrado exitosamente.');
        // Limpia el formulario después de un registro exitoso
        setFecha('');
        setHora('');
        setPaqueteria('');
        setOrdenEnvio('');
      })
      .catch(error => {
        console.error('Error al registrar el reporte de recolección:', error);
        alert('Hubo un error al registrar el reporte de recolección. Inténtalo de nuevo.');
      });
  };
  const goToAdminDashb = () => {
    navigate('/admin');
  };
  return (
    <div>
      <NavBarAdmin />
      <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
      <div className="form-container">
        <h1>Registrar Reporte de Recolección</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Paquetería:</label>
            <select
              value={paqueteria}
              onChange={(e) => setPaqueteria(e.target.value)}
              required
            >
              <option value="">Selecciona una paquetería</option>
              {paqueterias.map(p => (
                <option key={p.id} value={p.id}>{p.idpaqueteria}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Orden de Envío:</label>
            <select
              value={ordenEnvio}
              onChange={(e) => setOrdenEnvio(e.target.value)}
              required
            >
              <option value="">Selecciona una orden de envío</option>
              {ordenesEnvio.map(o => (
                <option key={o.id} value={o.id}>{o.idordenenvio}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-button">Registrar Reporte</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrarRecoleccion;
