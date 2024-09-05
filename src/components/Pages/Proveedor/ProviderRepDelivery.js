import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import '../../Css/ProviderRepDeli.css';
import { FaArrowLeft } from 'react-icons/fa';

const ProviderRepDeli = () => {
    const [reportesEntrega, setReportesEntrega] = useState([]);
    const [error, setError] = useState('');
    const [ordenes, setOrdenes] = useState({});
    const [productos, setProductos] = useState({});
    const [almacenes, setAlmacenes] = useState({});
    const [envios, setEnvios] = useState({});
    const [entregas, setEntregas] = useState({});
    const navigate = useNavigate();
    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                // Obtener todos los reportes de entrega
                const responseReportes = await fetch('http://127.0.0.1:8000/api/agr-reporteentrega/');
                const dataReportes = await responseReportes.json();
                setReportesEntrega(dataReportes);

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
                    enviosMap[envio.idenvio] = envio.hora;
                });
                setEnvios(enviosMap);

                // Obtener detalles de entregas
                const responseEntregas = await fetch('http://127.0.0.1:8000/api/ee-entrega/');
                const dataEntregas = await responseEntregas.json();
                const entregasMap = {};
                dataEntregas.forEach(entrega => {
                    entregasMap[entrega.identrega] = entrega.hora;
                });
                setEntregas(entregasMap);

            } catch (error) {
                console.error('Error fetching provider data:', error);
                setError('Failed to fetch provider data. Please try again.');
            }
        };

        fetchProviderData();
    }, [providerId]);

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
                            Reportes de Entrega
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
                                    <th>Hora de Entrega</th>
                                    <th>Fecha de Entrega</th>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportesEntrega.filter(reporte => ordenes[reporte.ordenenvio]).map((reporte) => (
                                    <tr key={reporte.idreportent}>
                                        <td>{reporte.idreportent}</td>
                                        <td>{reporte.estatus}</td>
                                        <td>{reporte.descripcion}</td>
                                        <td>{almacenes[reporte.almacen] || 'Almacén no encontrado'}</td>
                                        <td>{entregas[reporte.entrega] || 'Hora no encontrada'}</td>
                                        <td>{ordenes[reporte.ordenenvio]?.fecha || 'Orden de Envío no encontrada'}</td>
                                        <td>{productos[ordenes[reporte.ordenenvio]?.producto] || 'Producto no encontrado'}</td>
                                        <td>{ordenes[reporte.ordenenvio]?.cantidad || 'Cantidad no encontrada'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default ProviderRepDeli;
