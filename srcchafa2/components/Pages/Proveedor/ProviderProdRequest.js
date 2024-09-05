import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import '../../Css/ProviderProdRequest.css'

const ProviderProdRequest = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState('');
    const [productos, setProductos] = useState({});
    const [almacenes, setAlmacenes] = useState({});
    const navigate = useNavigate();
    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                // Obtener todas las solicitudes de productos para el proveedor logeado
                const responseSolicitudes = await fetch('http://127.0.0.1:8000/api/agr-solicitar-producto/');
                const dataSolicitudes = await responseSolicitudes.json();
                const filteredSolicitudes = dataSolicitudes.filter(solicitud => solicitud.proveedor === parseInt(providerId));
                setSolicitudes(filteredSolicitudes);

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
        <div className="ShowRequests">
            <NavBar />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h2 className="text-center">Solicitudes de Productos</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>ID Solicitud</th>
                                    <th>Cantidad</th>
                                    <th>Fecha de Solicitud</th>
                                    <th>Almacén</th>
                                    <th>Producto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solicitudes.map((solicitud) => (
                                    <tr key={solicitud.idsolicitud}>
                                        <td>{solicitud.idsolicitud}</td>
                                        <td>{solicitud.cantidad}</td>
                                        <td>{solicitud.fechasol}</td>
                                        <td>{almacenes[solicitud.almacen] || 'Almacén no encontrado'}</td>
                                        <td>{productos[solicitud.producto] || 'Producto no encontrado'}</td>
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

export default ProviderProdRequest;
