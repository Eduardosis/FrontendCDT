import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getProviderId, createClient } from '../../Apis/apiProviders';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Css/ProviderRegClients.css';

const ProviderRegClients = () => {
    const [nombrepila, setNombrepila] = useState('');
    const [apellidopat, setApellidopat] = useState('');
    const [apellidomat, setApellidomat] = useState('');
    const [codigopostal, setCodigopostal] = useState('');
    const [calle, setCalle] = useState('');
    const [numint, setNumint] = useState('');
    const [numext, setNumext] = useState('');
    const [colonia, setColonia] = useState('');
    const [telefono, setTelefono] = useState('');
    const [proveedor, setProveedor] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProviderId = async () => {
            try {
                const data = await getProviderId();
                setProveedor(data.provider_id);
                localStorage.setItem('provider_id', data.provider_id);
            } catch (error) {
                console.error('Error fetching provider ID:', error);
                setError('Failed to fetch provider ID. Please try again.');
            }
        };

        fetchProviderId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const clientData = {
                nombrepila,
                apellidopat,
                apellidomat,
                codigopostal,
                calle,
                numint,
                numext,
                colonia,
                telefono,
                proveedor: localStorage.getItem('provider_id')
            };
            const data = await createClient(clientData);
            setSuccess('Cliente creado exitosamente');
            setError('');
            console.log('Cliente creado:', data);
        } catch (error) {
            setError('Error al crear el cliente');
            setSuccess('');
            console.error('Error:', error);
        }
    };

    const handleBack = () => {
        navigate('/provider-dashboard');
    };

    return (
        <div className="CrearCliente">
            <NavBar />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={10} lg={8}>
                        <div className='create-box'>
                            <h2 className="text-center-h">Registrar Cliente</h2>
                            {success && <Alert variant="success">{success}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicNombre">
                                    <Form.Label className='bold-text'>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Introduce el nombre"
                                        value={nombrepila}
                                        onChange={(e) => setNombrepila(e.target.value)}
                                    />
                                </Form.Group>

                                <Row className="mt-3">
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="formBasicApellidoPat">
                                            <Form.Label className='bold-text'>Apellido Paterno</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Introduce el apellido paterno"
                                                value={apellidopat}
                                                onChange={(e) => setApellidopat(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="formBasicApellidoMat">
                                            <Form.Label className='bold-text'>Apellido Materno</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Introduce el apellido materno"
                                                value={apellidomat}
                                                onChange={(e) => setApellidomat(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="formBasicColonia" className="mt-3">
                                    <Form.Label className='bold-text'>Colonia</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Introduce la colonia"
                                        value={colonia}
                                        onChange={(e) => setColonia(e.target.value)}
                                    />
                                </Form.Group>
                                
                                <Row className="mt-3 form-row">
                                    <Col className="col">
                                        <Form.Group controlId="formBasicCodigoPostal">
                                            <Form.Label className='bold-text'>Código Postal</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Introduce el código postal"
                                                value={codigopostal}
                                                onChange={(e) => setCodigopostal(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col">
                                        <Form.Group controlId="formBasicNumInt">
                                            <Form.Label className='bold-text'>Número Interior</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Introduce el número interior"
                                                value={numint}
                                                onChange={(e) => setNumint(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col className="col">
                                        <Form.Group controlId="formBasicNumExt">
                                            <Form.Label className='bold-text'>Número Exterior</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Introduce el número exterior"
                                                value={numext}
                                                onChange={(e) => setNumext(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="formBasicCalle">
                                            <Form.Label className='bold-text'>Calle</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Introduce la calle"
                                                value={calle}
                                                onChange={(e) => setCalle(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="formBasicTelefono">
                                            <Form.Label className='bold-text'>Teléfono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Introduce el teléfono"
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button variant="outline-primary bold-text" type="submit" className="mt-4" block>
                                    Registrar Cliente
                                </Button>
                            </Form>
                            </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default ProviderRegClients;

