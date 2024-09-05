import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../Css/AdminRepoFalla.module.css'; 
import { logout } from '../../Apis/api';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const AdminReporteProFalla = ({ onLogout }) => {
  const [cantidad, setCantidad] = useState('');
  const [detalles, setDetalles] = useState('');
  const [fecha, setFecha] = useState('');
  const [producto, setProducto] = useState('');
  const [productos, setProductos] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    
    axios.get('http://127.0.0.1:8000/api/agr-productos/')
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
        setMessage('Error al cargar los productos');
      });
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };

  const goToAdminDashb = () => {
    navigate('/admin');
};

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      cantidad: parseInt(cantidad),
      detalles,
      fecha,
      producto, 
    };

    axios.post('http://127.0.0.1:8000/api/agr-reporteproducto-falla/', data)
      .then(response => {
        console.log('Datos enviados correctamente:', response.data);
        setMessage('Reporte de falla creado exitosamente');
      })
      .catch(error => {
        console.error('Error al enviar los datos:', error);
        setMessage('Error al crear el reporte de falla');
      });
  };

  return (
    <div>
      <NavBarNoMenu />
      <div>
        <button className='btn btn-success' onClick={goToAdminDashb}>Regresar</button>
      </div>
    <div className={styles.container}>
      
      
      <h2 className={styles.title}>Registrar Reporte de Producto con Falla</h2>

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
          <label>Detalles</label>
          <textarea
            className={styles.formControl}
            placeholder="Introduce los detalles de la falla"
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
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
          <label>Producto</label>
          <select
            className={styles.formControl}
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
            required
          >
            <option value="">Selecciona un producto</option>
            {productos.map(prod => (
              <option key={prod.id} value={prod.id}>
                {prod.idproducto} {}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.btnPrimary}>Registrar Reporte de Falla</button>
      </form>
      
    </div>
    <Footer />
    </div>
  );
};

export default AdminReporteProFalla;
