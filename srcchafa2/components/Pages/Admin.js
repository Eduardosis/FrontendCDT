import React, { useState, useEffect } from 'react';
import { logout } from '../Apis/api';
import { getAdminId } from '../Apis/apiProviders'; 
import '../Css/AdminDash.css'; 
import { Container, Row, Col, Button } from 'react-bootstrap';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ onLogout }) => {
    const [adminId, setAdminId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminId = async () => {
            try {
                const data = await getAdminId();
                setAdminId(data.idusuario);
                localStorage.setItem('admin_id', data.idusuario);
            } catch (error) {
                console.error('Error fetching provider ID:', error);
                setError('Failed to fetch provider ID. Please try again.');
            }
        };

        fetchAdminId();
    }, []);

    const handleLogout = () => {
        logout();
        onLogout();
        navigate('/login');
    };

    const goToReporteFalla = () => {
        navigate('/adminReporteProFalla');
    };
    const goToReporteRecibido = () => {
        navigate('/adminReporteProRecibido'); // Define esta ruta
    };

    const goToVerProductos = () => {
        navigate('/adminVerProductos'); // Define esta ruta
    };
    const goToReporteEntrega = () => {
        navigate('/adminreporteent'); // Define esta ruta
    };
    const goToReporteEnvio = () => {
        navigate('/adminreporteenv'); // Define esta ruta
    };
    const goToSolicitarProducto = () => {
        navigate('/adminsolicitarproducto'); // Define esta ruta
    };
    const goToAgregarProducto = () => {
        navigate('/adminproductos'); // Define esta ruta
    };
    const goToVerRepoFalla = () => {
        navigate('/adminverrepofalla'); // Define esta ruta
    };
    const goToReporteRecoleccion = () => {
        navigate('/adminreporterecoleccion'); // Define esta ruta
    };
    const goToverReporteRecoleccion = () => {
        navigate('/adminverreprecoleccion'); // Define esta ruta
    };
    const goToverReporteEntrega = () => {
        navigate('/adminrepentrega'); // Define esta ruta
    };
    const goToverReporteEnvio = () => {
        navigate('/adminverrepenvio'); // Define esta ruta
    };
    const goToverReporteRecibidos = () => {
        navigate('/adminverreprecibidos'); // Define esta ruta
    };

    return (
        <div className="AdminMenu">
        <NavBarNoMenu />
        <Button variant="danger" onClick={handleLogout} className="logout-button">
                        Logout
        </Button>
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <div className="menu-box">
                    <h2>Menú del Admin</h2>
                  
                    <Button variant="outline-primary" onClick={goToReporteFalla} className="m-2">
                        Registrar producto Faltante
                    </Button>
                    <Button variant="outline-primary" onClick={goToReporteRecibido} className="m-2">
                        Registrar producto Recibido
                    </Button>
                    <Button variant="outline-primary" onClick={goToVerProductos} className="m-2">
                        Ver producto
                    </Button>
                    <Button variant="outline-primary" onClick={goToReporteEntrega} className="m-2">
                        Reporte entrega
                    </Button>
                    <Button variant="outline-primary" onClick={goToReporteEnvio} className="m-2">
                        Reporte envio
                    </Button>
                    <Button variant="outline-primary" onClick={goToReporteRecoleccion} className="m-2">
                        Reporte Recoleccion
                    </Button>
                    <Button variant="outline-primary" onClick={goToSolicitarProducto} className="m-2">
                        Solicitar producto
                    </Button>
                    <Button variant="outline-primary" onClick={goToAgregarProducto} className="m-2">
                        Agregar producto
                    </Button>
                    <Button variant="outline-primary" onClick={goToverReporteRecibidos} className="m-2">
                        Ver reportes Recibidos
                    </Button>
                    <Button variant="outline-primary" onClick={goToVerRepoFalla} className="m-2">
                        Ver reportes Faltantes
                    </Button>
                    <Button variant="outline-primary" onClick={goToverReporteRecoleccion} className="m-2">
                        Ver reportes de Recoleccion
                    </Button>
                    <Button variant="outline-primary" onClick={goToverReporteEntrega} className="m-2">
                        Ver reportes de Entrega
                    </Button>
                    <Button variant="outline-primary" onClick={goToverReporteEnvio} className="m-2">
                        Ver reportes de Envio
                    </Button>
                    </div>
                </Col>
            </Row>
        </Container>
        <Footer/>
    </div>
    );
};

export default AdminDashboard;

