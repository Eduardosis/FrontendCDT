import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicion from './ModalEdicionRepEnvio'; 
import { Modal, Button, Alert } from 'react-bootstrap';
import '../../Css/adminverrepo.css';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReporteEnvio = () => {
  const [reportes, setReportes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [ordenesEnvio, setOrdenesEnvio] = useState([]);
  const [paqueterias, setPaqueterias] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);
  const [idAlmacen, setIdAlmacen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rutaFormData, setRutaFormData] = useState({
    hora: '',
    fecha: '',
    direccion: '',
    descripcion: '',
    envio: ''
  });
  const [selectedEnvio, setSelectedEnvio] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioId = localStorage.getItem('id');

    axios.get('http://127.0.0.1:8000/api/agr-almacen/')
      .then(response => {
        setAlmacenes(response.data);

        // Obtener el idalmacen del usuario
        const almacenUsuario = response.data.find(almacen => almacen.usuario === parseInt(usuarioId));
        if (almacenUsuario) {
          setIdAlmacen(almacenUsuario.idalmacen);
        }
      })
      .catch(error => console.error('Error al obtener los almacenes:', error));

    // Obtener las órdenes de envío
    axios.get('http://127.0.0.1:8000/api/p-ordenenvio/')
      .then(response => {
        setOrdenesEnvio(response.data);
      })
      .catch(error => console.error('Error al obtener las órdenes de envío:', error));

    // Obtener los envíos
    axios.get('http://127.0.0.1:8000/api/ee-envio/')
      .then(response => {
        setPaqueterias(response.data);
      })
      .catch(error => console.error('Error al obtener los envíos:', error));
  }, []);

  useEffect(() => {
    if (idAlmacen) {
      axios.get('http://127.0.0.1:8000/api/agr-reporteenvio/')
        .then(response => {
          // Filtrar los reportes por idalmacen
          const reportesFiltrados = response.data.filter(reporte => reporte.almacen === idAlmacen);
          setReportes(reportesFiltrados);
        })
        .catch(error => console.error('Error al obtener los reportes de envío:', error));
    }
  }, [idAlmacen]);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setReportes(reportes.map(r => r.idreporteenv === updatedReporte.idreporteenv ? updatedReporte : r));
    setReporteEdit(null);
  };

  const handleAddRuta = (envioId) => {
    setSelectedEnvio(envioId);
    setRutaFormData({ ...rutaFormData, envio: envioId });
    setShowModal(true);
  };

  const handleRutaChange = (e) => {
    const { name, value } = e.target;
    setRutaFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRutaSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/ee-ruta/', rutaFormData)
      .then(response => {
        console.log('Ruta creada:', response.data);
        setSuccessMessage('Ruta creada exitosamente.');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        setShowModal(false);
        setRutaFormData({
          hora: '',
          fecha: '',
          direccion: '',
          descripcion: '',
          envio: ''
        });
        setSelectedEnvio(null);
      })
      .catch(error => console.error('Error creando ruta:', error));
  };

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  return (
    <div>
      <NavBarAdmin />
      <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
      <div className="reportes-container">
        <h1>Reportes de Envío</h1>
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>ID Reporte</th>
                <th>Descripción</th>
                <th>Estatus</th>
                <th>Almacén</th>
                <th>Orden Envío</th>
                <th>Envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte) => (
                <tr key={reporte.idreporteenv}>
                  <td>{reporte.idreporteenv}</td>
                  <td>{reporte.descripcion}</td>
                  <td>{reporte.estatus}</td>
                  <td>{reporte.almacen}</td>
                  <td>{reporte.ordenenvio}</td>
                  <td>{reporte.envio}</td>
                  <td>
                    <button onClick={() => handleEdit(reporte)}>Editar</button>
                    <button onClick={() => handleAddRuta(reporte.envio)}>Crear rutas</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reporteEdit && (
          <ModalEdicion
            reporte={reporteEdit}
            almacenes={almacenes}
            ordenesEnvio={ordenesEnvio}
            paqueterias={paqueterias}
            onClose={() => setReporteEdit(null)}
            onSave={handleSave}
          />
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Ruta para Envío {selectedEnvio}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <form onSubmit={handleRutaSubmit}>
            <div className="form-group">
              <label htmlFor="hora">Hora</label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={rutaFormData.hora}
                onChange={handleRutaChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={rutaFormData.fecha}
                onChange={handleRutaChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={rutaFormData.direccion}
                onChange={handleRutaChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                value={rutaFormData.descripcion}
                onChange={handleRutaChange}
                required
              />
            </div>
            <Button variant="primary" type="submit">
              Crear Ruta
            </Button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default ReporteEnvio;