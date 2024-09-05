import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../Css/ProfileProvider.css';

const ProviderProfile = () => {
    const [provider, setProvider] = useState({});
    const [empresa, setEmpresa] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchProviderData = async () => {
            try {
                // Obtener detalles del proveedor
                const responseProvider = await fetch(`http://127.0.0.1:8000/api/p-proveedor/${providerId}/`);
                const dataProvider = await responseProvider.json();
                setProvider(dataProvider);

                // Obtener detalles de la empresa
                const responseEmpresa = await fetch(`http://127.0.0.1:8000/api/p-empresa/${dataProvider.empresa}/`);
                const dataEmpresa = await responseEmpresa.json();
                setEmpresa(dataEmpresa.nombre);
            } catch (error) {
                console.error('Error fetching provider data:', error);
                setError('Failed to fetch provider data. Please try again.');
            }
        };

        fetchProviderData();
    }, [providerId]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/p-proveedor/${providerId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(provider)
            });

            if (response.ok) {
                setEditMode(false);
                const updatedProvider = await response.json();
                setProvider(updatedProvider);
            } else {
                setError('Failed to update provider data. Please try again.');
            }
        } catch (error) {
            console.error('Error updating provider data:', error);
            setError('Failed to update provider data. Please try again.');
        }
    };

    const handleChange = (e) => {
        setProvider({
            ...provider,
            [e.target.name]: e.target.value
        });
    };

    const handleBack = () => {
        navigate('/provider-dashboard');
    };

    const handleChangePassword = () => {
        navigate('/provider-change-password');
    };

    return (
        <div className="ProfileProvider">
            <NavBar />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        <h2 className="text-center">Perfil del Proveedor</h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Card className="mt-3">
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="formNombrePila">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombrepila"
                                            value={provider.nombrepila || ''}
                                            onChange={handleChange}
                                            readOnly={!editMode}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formApellidoPat" className="mt-3">
                                        <Form.Label>Apellido Paterno</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="apellidopat"
                                            value={provider.apellidopat || ''}
                                            onChange={handleChange}
                                            readOnly={!editMode}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formApellidoMat" className="mt-3">
                                        <Form.Label>Apellido Materno</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="apellidomat"
                                            value={provider.apellidomat || ''}
                                            onChange={handleChange}
                                            readOnly={!editMode}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formTelefono" className="mt-3">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefono"
                                            value={provider.telefono || ''}
                                            onChange={handleChange}
                                            readOnly={!editMode}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="formEmpresa" className="mt-3">
                                        <Form.Label>Empresa</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="empresa"
                                            value={empresa}
                                            readOnly
                                        />
                                    </Form.Group>

                                    <div className="mt-4 d-flex justify-content-between">
                                        <Button variant="outline-primary" onClick={handleBack}>
                                            Regresar al Dashboard
                                        </Button>
                                        {!editMode ? (
                                            <Button variant="outline-success" onClick={handleEdit}>
                                                Editar Perfil
                                            </Button>
                                        ) : (
                                            <Button variant="outline-success" onClick={handleSave}>
                                                Guardar Cambios
                                            </Button>
                                        )}
                                        <Button variant="outline-warning" onClick={handleChangePassword}>
                                            Cambiar Contraseña
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default ProviderProfile;
