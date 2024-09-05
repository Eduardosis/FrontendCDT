import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProviderId } from '../Apis/apiProviders'; 
import { logout } from '../Apis/api';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';
import Footer from '../Footer/Footer';
import '../Css/ProviderDashboard.css'; 
import ListaClientes from './Listclientes';


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

    return (
        <div className="ProviderMenu">
        <NavBarNoMenu />
        <Button variant="danger" onClick={handleLogout} className="logout-button">
                        Logout
        </Button>
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <div className="menu-box">
                    <h2>Menú del Proveedor</h2>
                  
                    <Button variant="outline-primary" onClick={goToRegisterClients} className="m-2">
                        Registrar Clientes
                    </Button>
                    <Button variant="outline-primary" onClick={goToRegisterOrder} className="m-2">
                        Registrar Orden
                    </Button>
                    <Button variant="outline-primary" onClick={goToViewOrders} className="m-2">
                        Ver Órdenes
                    </Button>
                    <Button variant="outline-primary" onClick={ListaClientes} className="m-2">
                        Ver Clientes
                    </Button>
                    </div>
                </Col>
            </Row>
        </Container>
        
    </div>
);
};

export default ProviderDashboard;
