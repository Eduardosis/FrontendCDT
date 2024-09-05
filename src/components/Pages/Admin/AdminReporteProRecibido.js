import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../Css/AdminRepoRecibido.module.css'; // Importar CSS como módulo
import NavBar from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminReporteProRecibido = ({ onLogout }) => {
  const [cantidad, setCantidad] = useState('');
  const [fecha, setFecha] = useState('');
  const [solicitudpp, setSolicitudpp] = useState('');
  const [solicitudes, setSolicitudes] = useState([]); 
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioId = localStorage.getItem('id'); // Obtener el ID del usuario desde localStorage
    console.log('Usuario ID from localStorage:', usuarioId);

    axios.get('http://127.0.0.1:8000/api/agr-almacen/')
      .then(response => {
        // Obtener el idalmacen del usuario
        const almacenUsuario = response.data.find(almacen => almacen.usuario === parseInt(usuarioId));
        if (almacenUsuario) {
          const idAlmacen = almacenUsuario.idalmacen;

          // Obtener las solicitudes del almacén
          axios.get('http://127.0.0.1:8000/api/agr-solicitar-producto/')
            .then(response => {
              const solicitudesFiltradas = response.data.filter(solicitud => solicitud.almacen === idAlmacen);
              setSolicitudes(solicitudesFiltradas);
            })
            .catch(error => {
              console.error('Error al obtener las solicitudes:', error);
              setMessage('Error al cargar las solicitudes');
            });
        }
      })
      .catch(error => {
        console.error('Error al obtener los almacenes:', error);
      });
  }, []);

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
      <NavBar />
      <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
      <div className={styles.container + " mt-5"}>
        <h2 className={styles.title}>Registrar Reporte de Recibido</h2>

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
                <option key={sol.idsolicitud} value={sol.idsolicitud}>
                  {sol.idsolicitud}
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
