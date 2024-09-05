import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout, register } from '../Apis/api';
import NavBar from '../NavBar/NavBarAdmin';
import Footer from '../Footer/Footer';
import '../Css/AdminDash.css'; 

const AdminDashboard = ({ onLogout }) => {
    const [adminId, setAdminId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminId = async () => {
            try {
                const id = localStorage.getItem('id');
                console.log('Admin ID:', id); // Agrega un log para verificar el valor
                setAdminId(id);
            } catch (error) {
                console.error('Error fetching admin ID:', error);
                setError('Failed to fetch admin ID. Please try again.');
            }
        };
    
        fetchAdminId();
    }, []);
    
    
    const handleLogout = () => {
        logout();
        onLogout();
        navigate('/login');
    };

    const goToReporteFalla = () => navigate('/adminReporteProFalla');
    const goToReporteRecibido = () => navigate('/adminReporteProRecibido');
    const goToVerProductos = () => navigate('/adminVerProductos');

    const ReporteEntregas = () => navigate('/entrega');
    const ReporteEnvios = () => navigate('/envio');

    const goToSolicitarProducto = () => navigate('/adminsolicitarproducto');
    const goToAgregarProducto = () => navigate('/adminproductos');
    const AdminVerRepEntrega = () => {
        navigate('/adminrepentrega'); // Nueva ruta para ver reportes de entrega
    };

    const AdminVerRepRecibidos = () => {
        navigate('/adminverreprecibidos'); // Nueva ruta para ver reportes recibidos
    };
    const AdminverRepEnvio = () => {
        navigate('/adminverrepenvio'); // Nueva ruta para ver reportes de envío
    };
    const AdminVerRepRecoleccion = () => {
        navigate('/adminverreprecoleccion'); // Nueva ruta para ver reportes de recolección
    };
    const AdminReporteRecoleccion = () => {
        navigate('/adminreporterecoleccion'); // Nueva ruta para reportar recolección
    };
    const AdminVerRepoFalla = () => {
        navigate('/adminverrepofalla'); // Nueva ruta para ver reportes de fallas
    };
    const AdminAgregarRepartidor = () => {
        navigate('/adminagregarrepartidor'); 
    };
    const AdminAgregarCamion = () => {
        navigate('/adminagregarcamion'); 
    };
    const AdminVerRepartidor = () => {
        navigate('/adminverrepartidor'); 
    };

    return (
        <div className="AdminMenu">
            <NavBar onLogout={handleLogout} />
            <Container className="mt-5 admin-menu-container">
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <div className="menu-box">
                            <h2>Menú del Admin</h2>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToVerProductos} className="m-2 btn-admin">
                                        Ver producto
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminVerRepRecibidos} className="m-2 btn-admin">
                                        Ver Reportes de recibidos
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminverRepEnvio} className="m-2 btn-admin">
                                        Ver Reportes de envío 
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminVerRepRecoleccion} className="m-2 btn-admin">
                                        Ver Reportes de recolección 
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminVerRepoFalla} className="m-2 btn-admin">
                                        Ver Reportes de fallas
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminVerRepEntrega} className="m-2 btn-admin">
                                        Ver Reportes de entregas 
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToReporteFalla} className="m-2 btn-admin">
                                        Registrar fallas de productos
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToReporteRecibido} className="m-2 btn-admin">
                                        Registrar productos recibidos
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={ReporteEntregas} className="m-2 btn-admin">
                                        Agregar reporte de entrega
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={ReporteEnvios} className="m-2 btn-admin">
                                        Agregar reporte de envío
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToAgregarProducto} className="m-2 btn-admin">
                                        Agregar producto
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminReporteRecoleccion} className="m-2 btn-admin">
                                        Agregar reporte de recolección 
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={goToSolicitarProducto} className="m-2 btn-admin">
                                        Solicitar producto
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminAgregarRepartidor} className="m-2 btn-admin">
                                        Agregar Repartidor
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminAgregarCamion} className="m-2 btn-admin">
                                        Agregar Camion
                                    </Button>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Button variant="outline-primary" onClick={AdminVerRepartidor} className="m-2 btn-admin">
                                        Ver Repartidores
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
