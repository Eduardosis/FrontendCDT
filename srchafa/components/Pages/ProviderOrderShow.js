import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProviderOrders } from '../Apis/apiProviders';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';
import Footer from '../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Css/ProviderOrderShow.css';

const ProviderOrderShow = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const providerId = localStorage.getItem('provider_id');
                const orderData = await getProviderOrders(providerId);
                setOrders(orderData.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to fetch orders. Please try again.');
            }
        };

        fetchOrders();
    }, []);

    const handleBack = () => {
        navigate('/provider-dashboard');
    };

    return (
        <div className="ShowOrders">
            <NavBarNoMenu />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h2 className="text-center">Órdenes de Envío</h2>
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
                                        <td>{order.destinatario.nombre}</td>
                                        <td>{order.producto.nombre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button variant="outline-primary" onClick={handleBack} className="mt-4" block>
                            Regresar al Dashboard
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default ProviderOrderShow;
