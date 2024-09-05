import React, { useState, useEffect } from "react";
import axios from 'axios';
import NavBarAdmin from "../../NavBar/NavBarAdmin";
import Footer from '../../Footer/Footer';
import '../../Css/ReporteEntrega.css'; 
import { FaArrowLeft } from 'react-icons/fa';
import { VscAdd } from "react-icons/vsc";
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ReporteEntregas = () => {
  const [entregas, setEntregas] = useState([]);
  const [envios, setEnvios] = useState([]);
  const [ordenesEnvio, setOrdenesEnvio] = useState([]); // Añadido para almacenar órdenes de envío
  const [formData, setFormData] = useState({
    estatus: '',
    descripcion: '',
    almacen: '',
    entrega: '',
    ordenenvio: ''
  });
  const [entregaFormData, setEntregaFormData] = useState({
    fecha: '',
    hora: '',
    envio: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [ultimoEntrega, setUltimoEntrega] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioId = localStorage.getItem('id'); // Obtener el ID del usuario desde localStorage
    console.log('Usuario ID from localStorage:', usuarioId);

    // Obtener el almacén asociado al usuario
    axios.get('http://127.0.0.1:8000/api/agr-almacen/')
      .then(response => {
        console.log('Response data:', response.data);
        const almacenUsuario = response.data.find(almacen => almacen.usuario === parseInt(usuarioId));
        if (almacenUsuario) {
          const idAlmacen = almacenUsuario.idalmacen;
          console.log('Almacén ID:', idAlmacen);
          setFormData(prevData => ({
            ...prevData,
            almacen: idAlmacen
          }));
        } else {
          console.error('No se encontró un almacén para el usuario.');
        }
      })
      .catch(error => console.error('Error fetching almacenes:', error));

    // Cargar datos de entregas
    axios.get('http://127.0.0.1:8000/api/ee-entrega/')
      .then(response => setEntregas(response.data))
      .catch(error => console.error('Error fetching entregas:', error));

    // Cargar datos de envios
    axios.get('http://127.0.0.1:8000/api/ee-envio/')
      .then(response => setEnvios(response.data))
      .catch(error => console.error('Error fetching envios:', error));
      
    // Cargar datos de órdenes de envío
    axios.get('http://127.0.0.1:8000/api/p-ordenenvio/')
      .then(response => setOrdenesEnvio(response.data))
      .catch(error => console.error('Error fetching órdenes de envío:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'entrega') {
      const entregaSeleccionada = entregas.find(entrega => entrega.identrega === parseInt(value));
      if (entregaSeleccionada) {
        axios.get(`http://127.0.0.1:8000/api/ee-envio/${entregaSeleccionada.envio}/`)
          .then(responseEnvio => {
            const recoleccionId = responseEnvio.data.recoleccion;
            axios.get(`http://127.0.0.1:8000/api/agr-reporte-recoleccion/${recoleccionId}/`)
              .then(responseRecoleccion => {
                setFormData(prevData => ({
                  ...prevData,
                  ordenenvio: responseRecoleccion.data.ordenenvio
                }));
              })
              .catch(error => console.error('Error fetching recoleccion:', error));
          })
          .catch(error => console.error('Error fetching envio:', error));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data before sending:', formData);
    axios.post('http://127.0.0.1:8000/api/agr-reporteentrega/', formData)
      .then(response => {
        console.log('Reporte de entrega enviado:', response.data);
        setMessage('Reporte de entrega enviado exitosamente.');
        setError('');
        setTimeout(() => {
          window.location.reload(); // Recargar la página después de 2 segundos
        }, 2000);
      })
      .catch(error => {
        console.error('Error enviando reporte de entrega:', error);
        setMessage('');
        setError('Error al enviar el reporte de entrega. Por favor, inténtalo de nuevo.');
      });
  };

  const handleEntregaChange = (e) => {
    const { name, value } = e.target;
    setEntregaFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEntregaSubmit = (e) => {
    e.preventDefault();
    console.log('Entrega Form Data before sending:', entregaFormData);
    axios.post('http://127.0.0.1:8000/api/ee-entrega/', entregaFormData)
      .then(response => {
        console.log('Entrega creada:', response.data);
        setUltimoEntrega(response.data);
        setShowModal(false);

        // Obtener la orden de envío relacionada
        axios.get(`http://127.0.0.1:8000/api/ee-envio/${response.data.envio}/`)
          .then(envioResponse => {
            const recoleccionId = envioResponse.data.recoleccion;
            axios.get(`http://127.0.0.1:8000/api/agr-reporte-recoleccion/${recoleccionId}/`)
              .then(recoleccionResponse => {
                setFormData(prevData => ({
                  ...prevData,
                  entrega: response.data.identrega,
                  ordenenvio: recoleccionResponse.data.ordenenvio
                }));
              })
              .catch(error => console.error('Error fetching recolección relacionada:', error));
          })
          .catch(error => console.error('Error fetching envio:', error));
      })
      .catch(error => console.error('Error creando entrega:', error));
  };

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  return (
    <div className="full">
      <NavBarAdmin />
      <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
      <div className="entregas-form">
        <h1 className="titles">Reporte de Entregas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estatus">Estatus</label>
              <select
                id="estatus"
                name="estatus"
                value={formData.estatus}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un estatus</option>
                <option value="Entregado">Entregado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="descripcion" className="label">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="5"
                className="input textarea"
                value={formData.descripcion}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="entrega" className="label">Entrega <VscAdd className="add-icon" onClick={() => setShowModal(true)} /></label>
              <select
                id="entrega"
                name="entrega"
                className="input"
                value={formData.entrega}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una entrega</option>
                {entregas.map(entrega => (
                  <option key={entrega.identrega} value={entrega.identrega}>
                    {entrega.identrega}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ordenenvio" className="label">Orden de Envío</label>
              <select
                id="ordenenvio"
                name="ordenenvio"
                className="input"
                value={formData.ordenenvio}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una orden de envío</option>
                {ordenesEnvio.map(orden => (
                  <option key={orden.idordenenvio} value={orden.idordenenvio}>
                    {orden.idordenenvio}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn">Enviar Reporte</button>
        </form>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {/* Modal para agregar nuevas entregas */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEntregaSubmit}>
            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                id="fecha"
                name="fecha"
                type="date"
                className="form-control"
                value={entregaFormData.fecha}
                onChange={handleEntregaChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="hora">Hora</label>
              <input
                id="hora"
                name="hora"
                type="time"
                className="form-control"
                value={entregaFormData.hora}
                onChange={handleEntregaChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="envio">Envío</label>
              <select
                id="envio"
                name="envio"
                className="form-control"
                value={entregaFormData.envio}
                onChange={handleEntregaChange}
                required
              >
                <option value="">Selecciona un envío</option>
                {envios.map(envio => (
                  <option key={envio.idenvio} value={envio.idenvio}>
                    {envio.idenvio}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="primary" type="submit">
              Agregar Entrega
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Footer />
    </div>
  );
};

export default ReporteEntregas;
