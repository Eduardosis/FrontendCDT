import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../Css/AdminRepoFalla.module.css'; 
import { logout } from '../../Apis/api';
import NavBar from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminReporteProFalla = ({ onLogout }) => {
  const [cantidad, setCantidad] = useState('');
  const [detalles, setDetalles] = useState('');
  const [fecha, setFecha] = useState('');
  const [producto, setProducto] = useState('');
  const [productos, setProductos] = useState([]);
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

          // Obtener los productos del almacén
          axios.get('http://127.0.0.1:8000/api/agr-productos/')
            .then(response => {
              const productosFiltrados = response.data.filter(producto => producto.almacen === idAlmacen);
              setProductos(productosFiltrados);
            })
            .catch(error => {
              console.error('Error al obtener los productos:', error);
              setMessage('Error al cargar los productos');
            });
        }
      })
      .catch(error => {
        console.error('Error al obtener los almacenes:', error);
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
      <NavBar />
      <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
      <div className={styles.container}>
        <h2 className={styles.title}>Registrar Reporte de Falla</h2>

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
                <option key={prod.idproducto} value={prod.idproducto}>
                  {prod.nombre}
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
