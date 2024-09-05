import React, { useState, useEffect } from "react";
import axios from 'axios';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import '../../Css/ReporteEnvios.css'; 
import { FaArrowLeft } from 'react-icons/fa';
import { VscAdd } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

const ReporteEnvios = () => {
    const [envios, setEnvios] = useState([]);
    const [ordenesEnvio, setOrdenesEnvio] = useState([]);
    const [recolecciones, setRecolecciones] = useState([]);
    const [ultimoEnvio, setUltimoEnvio] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        estatus: '',
        descripcion: '',
        almacen: '',
        envio: '',
        ordenenvio: ''
    });
    const [envioFormData, setEnvioFormData] = useState({
        fecha: '',
        hora: '',
        recoleccion: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
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

        // Cargar datos de envíos
        axios.get('http://127.0.0.1:8000/api/ee-envio/')
            .then(response => setEnvios(response.data))
            .catch(error => console.error('Error fetching envios:', error));

        // Cargar datos de ordenes de envio
        axios.get('http://127.0.0.1:8000/api/p-ordenenvio/')
            .then(response => setOrdenesEnvio(response.data))
            .catch(error => console.error('Error fetching ordenesEnvio:', error));

        // Cargar datos de recolecciones
        axios.get('http://127.0.0.1:8000/api/agr-reporte-recoleccion/')
            .then(response => {
                console.log('Recolecciones:', response.data);  // Verifica que los datos sean correctos
                setRecolecciones(response.data);
            })
            .catch(error => console.error('Error fetching recolecciones:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEnvioChange = (e) => {
        const { name, value } = e.target;
        setEnvioFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data before sending:', formData);
        axios.post('http://127.0.0.1:8000/api/agr-reporteenvio/', formData)
            .then(response => {
                console.log('Reporte enviado:', response.data);
                // Limpiar el formulario y mostrar el mensaje de éxito
                setFormData({
                    estatus: '',
                    descripcion: '',
                    almacen: formData.almacen,
                    envio: '',
                    ordenenvio: ''
                });
                setSuccessMessage('Reporte enviado exitosamente.');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            })
            .catch(error => console.error('Error enviando reporte:', error));
    };

    const handleEnvioSubmit = (e) => {
      e.preventDefault();
      console.log('Envio Form Data before sending:', envioFormData);
      axios.post('http://127.0.0.1:8000/api/ee-envio/', envioFormData)
          .then(response => {
              console.log('Envio creado:', response.data);
              setUltimoEnvio(response.data);
              setShowModal(false);
  
              // Obtener la recolección y la orden de envío relacionada
              axios.get(`http://127.0.0.1:8000/api/agr-reporte-recoleccion/${response.data.recoleccion}/`)
                  .then(recoleccionResponse => {
                      const recoleccionData = recoleccionResponse.data;
                      setFormData(prevData => ({
                          ...prevData,
                          envio: response.data.idenvio,
                          ordenenvio: recoleccionData.ordenenvio
                      }));
                  })
                  .catch(error => console.error('Error fetching recolección relacionada:', error));
              
              // Redirigir a la misma página para actualizar los datos
              navigate(0);
          })
          .catch(error => console.error('Error creando envio:', error));
  };  

    const goToAdminDashb = () => {
        navigate('/admin');
    };

    return (
        <div className="full">
            <NavBarAdmin />
            <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
            <div className="order-form">
                <h1>Reporte de Envíos</h1>
                <form onSubmit={handleSubmit}>
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
                                <option value="En camino">En camino</option>
                                <option value="Con retraso">Con retraso</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows="5"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="envio">Envío <VscAdd className="add-icon" onClick={() => setShowModal(true)} /></label>
                        <select
                            id="envio"
                            name="envio"
                            value={formData.envio}
                            onChange={handleChange}
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
                    <div className="form-group">
                        <label htmlFor="ordenenvio">Orden de Envío</label>
                        <select
                            id="ordenenvio"
                            name="ordenenvio"
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
                    <button type="submit">Enviar</button>
                </form>
                {successMessage && <div className="success-message">{successMessage}</div>}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Envío</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEnvioSubmit}>
                        <div className="form-group">
                            <label htmlFor="fecha">Fecha</label>
                            <input
                                type="date"
                                id="fecha"
                                name="fecha"
                                value={envioFormData.fecha}
                                onChange={handleEnvioChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hora">Hora</label>
                            <input
                                type="time"
                                id="hora"
                                name="hora"
                                value={envioFormData.hora}
                                onChange={handleEnvioChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="recoleccion">Recolección</label>
                            <select
                                id="recoleccion"
                                name="recoleccion"
                                value={envioFormData.recoleccion}
                                onChange={handleEnvioChange}
                                required
                            >
                                <option value="">Selecciona una recolección</option>
                                {recolecciones.map(recoleccion => (
                                    <option key={recoleccion.idrecoleccionp} value={recoleccion.idrecoleccionp}>
                                        {recoleccion.idrecoleccionp}  
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit">Crear Envío</button>
                    </form>
                </Modal.Body>
            </Modal>

            <Footer />
        </div>
    );
};

export default ReporteEnvios;
