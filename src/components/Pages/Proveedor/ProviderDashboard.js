import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProviderId } from '../../Apis/apiProviders'; 
import { logout } from '../../Apis/api';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import '../../Css/ProviderDashboard.css'; 


const ProviderDashboard = ({ onLogout }) => {
    const [providerId, setProviderId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProviderId = async () => {
            try {
                const data = await getProviderId();
                setProviderId(data.provider_id);
                localStorage.setItem('provider_id', data.provider_id);
            } catch (error) {
                console.error('Error fetching provider ID:', error);
                setError('Failed to fetch provider ID. Please try again.');
            }
        };

        fetchProviderId();
    }, []);

    const handleLogout = () => {
        logout();
        onLogout();
        navigate('/login');
    };

    const goToRegisterClients = () => {
        navigate('/provider-reg-clients');
    };

    const goToRegisterOrder = () => {
        navigate('/provider-create-order'); // Define esta ruta
    };

    const goToViewOrders = () => {
        navigate('/provider-show-order'); // Define esta ruta
    };

    const goToViewReportsShip = () => {
        navigate('/provider-rep-ship'); // Nueva ruta para ver reportes de envío
    };

    const goToViewReportsDeli = () => {
        navigate('/provider-rep-deli'); // Nueva ruta para ver reportes de envío
    };

    const goToViewReportsProdRequ = () => {
        navigate('/provider-prod-request'); // Nueva ruta para ver reportes de solicitud de productos
    };

    const ProductosList = () => {
        navigate('/productos'); // Nueva ruta para ver productos
    };


 return (
        <div className="ProviderMenu">
            <NavBar onLogout={handleLogout}/>
            <Container className="mt-10 provider-menu-container">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <div className="menu-box">
                            <h2>Menú del Proveedor</h2>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToRegisterClients} className="m-2 btn-provider">
                                        Registrar Clientes
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToRegisterOrder} className="m-2 btn-provider">
                                        Registrar Orden
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToViewOrders} className="m-2 btn-provider">
                                        Ver Órdenes
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToViewReportsShip} className="m-2 btn-provider">
                                        Ver Reportes de Envio
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToViewReportsDeli} className="m-2 btn-provider">
                                        Ver Reportes de Entrega
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={ProductosList} className="m-2 btn-provider">
                                        Ver Productos
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToViewReportsProdRequ} className="m-2 btn-provider">
                                        Ver Reportes de solicitud de productos
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer/>    
        </div>
    );
};


export default ProviderDashboard;
