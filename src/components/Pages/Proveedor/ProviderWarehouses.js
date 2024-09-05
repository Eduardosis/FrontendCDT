import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import '../../Css/ProviderWarehouses.css'; // Asegúrate de que esta hoja de estilo esté incluida
import { FaArrowLeft } from 'react-icons/fa';

const ProviderWarehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                // Obtener todos los almacenes
                const responseAlmacenes = await fetch('http://127.0.0.1:8000/api/agr-almacen/');
                const dataAlmacenes = await responseAlmacenes.json();
                // Obtener relación proveedor-almacén
                const responseAlmacenProveedor = await fetch('http://127.0.0.1:8000/api/agr-almacen-proveedor/');
                const dataAlmacenProveedor = await responseAlmacenProveedor.json();
                // Filtrar almacenes por proveedor logeado
                const filteredAlmacenesProveedor = dataAlmacenProveedor.filter(ap => ap.proveedor === parseInt(providerId));
                const almacenesIds = filteredAlmacenesProveedor.map(ap => ap.almacen);
                const filteredAlmacenes = dataAlmacenes.filter(almacen => almacenesIds.includes(almacen.idalmacen));
                setWarehouses(filteredAlmacenes);
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
        <div className="ShowWarehouses">
            <NavBar />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h2 className="text-center">
                            Almacenes del Proveedor
                            <FaArrowLeft className="back-arrow1" onClick={handleBack} />
                        </h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>ID Almacén</th>
                                    <th>Nombre</th>
                                    <th>Estatus</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                </tr>
                            </thead>
                            <tbody>
                                {warehouses.map((almacen) => (
                                    <tr key={almacen.idalmacen}>
                                        <td>{almacen.idalmacen}</td>
                                        <td>{almacen.nombre}</td>
                                        <td>{almacen.estatus}</td>
                                        <td>{almacen.direccion}</td>
                                        <td>{almacen.telefono}</td>
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

export default ProviderWarehouses;
