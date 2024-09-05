import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import '../../Css/ProviderOrderShow.css';
import { FaArrowLeft } from 'react-icons/fa';

const ProviderOrderShow = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [productos, setProductos] = useState({});
    const [clientes, setClientes] = useState([]);
    const navigate = useNavigate();
    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Obtener órdenes del proveedor logeado
                const responseOrders = await fetch('http://127.0.0.1:8000/api/p-ordenenvio/');
                const dataOrders = await responseOrders.json();
                const filteredOrders = dataOrders.filter(order => order.proveedor === parseInt(providerId));
                setOrders(filteredOrders);

                // Obtener clientes del proveedor logeado
                const responseClientes = await fetch('http://127.0.0.1:8000/api/p-clientesp/');
                const dataClientes = await responseClientes.json();
                const filteredClientes = dataClientes.filter(cliente => cliente.proveedor === parseInt(providerId));

                // Crear un objeto de clientes con sus IDs como clave para acceso rápido
                const clientesMap = {};
                filteredClientes.forEach(cliente => {
                    clientesMap[cliente.idclientep] = `${cliente.nombrepila} ${cliente.apellidopat} ${cliente.apellidomat}`;
                });

                setClientes(clientesMap);

                // Obtener relación producto-proveedor
                const responseProductos = await fetch('http://127.0.0.1:8000/api/agr-producto-proveedor/');
                const dataProductos = await responseProductos.json();
                const filteredProductos = dataProductos.filter(prodProv => prodProv.proveedor === parseInt(providerId));

                // Obtener detalles de productos y asociarlos con sus IDs
                const productosConDetalles = await Promise.all(filteredProductos.map(async (prodProv) => {
                    const responseProducto = await fetch(`http://127.0.0.1:8000/api/agr-productos/${prodProv.producto}/`);
                    const dataProducto = await responseProducto.json();
                    return {
                        id: prodProv.producto,
                        name: dataProducto.nombre,
                    };
                }));

                // Crear un objeto de productos con sus IDs como clave para acceso rápido
                const productosMap = {};
                productosConDetalles.forEach(prod => {
                    productosMap[prod.id] = prod.name;
                });

                setProductos(productosMap);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to fetch orders. Please try again.');
            }
        };

        fetchOrders();
    }, [providerId]);

    const handleBack = () => {
        navigate('/provider-dashboard');
    };

    return (
        <div className="ShowOrders">
            <NavBar />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h2 className="text-center">
                            Órdenes de Envío
                            <FaArrowLeft className="back-arrow" onClick={handleBack} />
                        </h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>ID Orden</th>
                                    <th>Fecha</th>
                                    <th>Cantidad</th>
                                    <th>Destinatario</th>
                                    <th>Producto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.idordenenvio}>
                                        <td>{order.idordenenvio}</td>
                                        <td>{order.fecha}</td>
                                        <td>{order.cantidad}</td>
                                        <td>{clientes[order.destinatario] || 'Cliente no encontrado'}</td>
                                        <td>{productos[order.producto] || 'Producto no encontrado'}</td>
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

export default ProviderOrderShow;
