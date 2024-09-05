import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowLeft } from 'react-icons/fa';

const ProviderRepShip = () => {
    const [reportesEnvio, setReportesEnvio] = useState([]);
    const [error, setError] = useState('');
    const [ordenes, setOrdenes] = useState({});
    const [productos, setProductos] = useState({});
    const [almacenes, setAlmacenes] = useState({});
    const [envios, setEnvios] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedEnvio, setSelectedEnvio] = useState(null);
    const [rutas, setRutas] = useState([]);
    const navigate = useNavigate();
    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                // Obtener todos los reportes de envío
                const responseReportes = await fetch('http://127.0.0.1:8000/api/agr-reporteenvio/');
                const dataReportes = await responseReportes.json();
                setReportesEnvio(dataReportes);

                // Obtener todas las órdenes de envío y filtrar por proveedor logeado
                const responseOrdenes = await fetch('http://127.0.0.1:8000/api/p-ordenenvio/');
                const dataOrdenes = await responseOrdenes.json();
                const filteredOrdenes = dataOrdenes.filter(orden => orden.proveedor === parseInt(providerId));

                // Crear un objeto de órdenes con sus IDs como clave para acceso rápido
                const ordenesMap = {};
                filteredOrdenes.forEach(orden => {
                    ordenesMap[orden.idordenenvio] = orden;
                });
                setOrdenes(ordenesMap);

                // Obtener detalles de productos
                const responseProductos = await fetch('http://127.0.0.1:8000/api/agr-productos/');
                const dataProductos = await responseProductos.json();
                const productosMap = {};
                dataProductos.forEach(producto => {
                    productosMap[producto.idproducto] = producto.nombre;
                });
                setProductos(productosMap);

                // Obtener detalles de almacenes
                const responseAlmacenes = await fetch('http://127.0.0.1:8000/api/agr-almacen/');
                const dataAlmacenes = await responseAlmacenes.json();
                const almacenesMap = {};
                dataAlmacenes.forEach(almacen => {
                    almacenesMap[almacen.idalmacen] = almacen.nombre;
                });
                setAlmacenes(almacenesMap);

                // Obtener detalles de envíos
                const responseEnvios = await fetch('http://127.0.0.1:8000/api/ee-envio/');
                const dataEnvios = await responseEnvios.json();
                const enviosMap = {};
                dataEnvios.forEach(envio => {
                    enviosMap[envio.idenvio] = envio;
                });
                setEnvios(enviosMap);

            } catch (error) {
                console.error('Error fetching provider data:', error);
                setError('Failed to fetch provider data. Please try again.');
            }
        };

        fetchProviderData();
    }, [providerId]);

    const handleViewRutas = async (envioId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/ee-ruta/`);
            const data = await response.json();
            const filteredRutas = data.filter(ruta => ruta.envio === envioId);
            setRutas(filteredRutas);
            setSelectedEnvio(envioId);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching rutas:', error);
            setError('Failed to fetch rutas. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedEnvio(null);
        setRutas([]);
    };

    const handleBack = () => {
        navigate('/provider-dashboard');
    };

    return (
        <div className="ShowReports">
            <NavBar />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h2 className="text-center">
                            Reportes de Envios
                            <FaArrowLeft className="back-arrow" onClick={handleBack} />
                        </h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>ID Reporte</th>
                                    <th>Estatus</th>
                                    <th>Descripción</th>
                                    <th>Almacén</th>
                                    <th>Hora de Envío</th>
                                    <th>Fecha de Envío</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Detalles del envio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportesEnvio.filter(reporte => ordenes[reporte.ordenenvio]).map((reporte) => (
                                    <tr key={reporte.idreporteenv}>
                                        <td>{reporte.idreporteenv}</td>
                                        <td>{reporte.estatus}</td>
                                        <td>{reporte.descripcion}</td>
                                        <td>{almacenes[reporte.almacen] || 'Almacén no encontrado'}</td>
                                        <td>{envios[reporte.envio]?.hora || 'Hora no encontrada'}</td>
                                        <td>{envios[reporte.envio]?.fecha || 'Fecha no encontrada'}</td>
                                        <td>{productos[ordenes[reporte.ordenenvio]?.producto] || 'Producto no encontrado'}</td>
                                        <td>{ordenes[reporte.ordenenvio]?.cantidad || 'Cantidad no encontrada'}</td>
                                        <td>
                                            <Button variant="info" onClick={() => handleViewRutas(reporte.envio)} style={{ backgroundColor: '#b647f5', borderColor: '#5c217d' }}>
                                                Ver Rutas
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Rutas del Envío {selectedEnvio}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {rutas.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Hora</th>
                                    <th>Fecha</th>
                                    <th>Dirección</th>
                                    <th>Descripción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rutas.map((ruta) => (
                                    <tr key={ruta.idruta}>
                                        <td>{ruta.hora}</td>
                                        <td>{ruta.fecha}</td>
                                        <td>{ruta.direccion}</td>
                                        <td>{ruta.descripcion}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p>No hay rutas disponibles para este envío.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </div>
    );
};

export default ProviderRepShip;
