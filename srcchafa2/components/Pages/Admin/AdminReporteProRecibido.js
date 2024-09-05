import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logout } from '../../Apis/api';
import styles from '../../Css/AdminRepoRecibido.module.css'; // Importar CSS como módulo
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const AdminReporteProRecibido = ({ onLogout }) => {
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [solicitudpp, setSolicitudpp] = useState('');
  const [solicitudes, setSolicitudes] = useState([]); 
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener solicitudes de la API
    axios.get('http://127.0.0.1:8000/api/agr-solicitar-producto/')
      .then(response => {
        setSolicitudes(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las solicitudes:', error);
        setMessage('Error al cargar las solicitudes');
      });
  }, []);

  /*const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };*/

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    const data = {
      cantidad: parseInt(cantidad),
      fecha,
      solicitudpp: parseInt(solicitudpp), 
    };

    axios.post('http://127.0.0.1:8000/api/agr-reporte-producto-recibidos/', data)
      .then(response => {
        console.log('Datos enviados correctamente:', response.data);
        setMessage('Reporte creado exitosamente');
      })
      .catch(error => {
        console.error('Error al enviar los datos:', error.response ? error.response.data : error.message);
        setMessage('Error al crear el reporte');
      });
  };

  return (
    <div>
      <NavBarNoMenu />
      <div>
        <button className='btn btn-success' onClick={goToAdminDashb}>Regresar</button>
      </div>
    <div className={styles.container + " mt-5"}>
      
      <h2 className={styles.title + " text-center mb-4"}>Registrar Reporte de Producto Recibido</h2>

      {message && <p className={message.includes('Error') ? styles.textDanger : styles.textSuccess}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Cantidad</label>
          <input
            type="number"
            className={styles.formControl}
            placeholder="Introduce la cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Fecha</label>
          <input
            type="date"
            className={styles.formControl}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>ID de Solicitud Producto</label>
          <select
            className={styles.formControl}
            value={solicitudpp}
            onChange={(e) => setSolicitudpp(e.target.value)} 
            required
          >
            <option value="">Selecciona una solicitud</option>
            {solicitudes.map(sol => (
              <option key={sol.id} value={sol.id}>
                {sol.idsolicitud} {}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.btnPrimary + " btn btn-primary btn-block"}>Registrar Reporte</button>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default AdminReporteProRecibido;
