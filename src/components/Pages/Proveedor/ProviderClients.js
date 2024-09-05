import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Css/ProviderClients.css';
import { FaArrowLeft } from 'react-icons/fa';

const ProviderClients = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/p-clientesp/');
                const data = await response.json();
                const filteredClients = data.filter(client => client.proveedor === parseInt(providerId));
                setClients(filteredClients);
            } catch (error) {
                console.error('Error fetching clients:', error);
                setError('Failed to fetch clients. Please try again.');
            }
        };

        fetchClients();
    }, [providerId]);

    const handleClientClick = (client) => {
        setSelectedClient(client);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedClient(null);
    };

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/p-clientesp/${selectedClient.idclientep}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedClient),
            });

            if (response.ok) {
                setClients(clients.map(client => client.idclientep === selectedClient.idclientep ? selectedClient : client));
                handleCloseModal();
            } else {
                console.error('Failed to save changes.');
                setError('Failed to save changes. Please try again.');
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            setError('Error saving changes. Please try again.');
        }
    };

    const handleDeleteClient = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/p-clientesp/${selectedClient.idclientep}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setClients(clients.filter(client => client.idclientep !== selectedClient.idclientep));
                handleCloseModal();
            } else {
                console.error('Failed to delete client.');
                setError('Failed to delete client. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            setError('Error deleting client. Please try again.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedClient({ ...selectedClient, [name]: value });
    };

    const handleBack = () => {
        navigate('/provider-dashboard');
    };

    return (
        <div className="ShowClients">
            <NavBar />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12}>
                         <h2 className="text-center">
                            Clientes
                            <FaArrowLeft className="back-arrow1" onClick={handleBack} />
                        </h2>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <Row>
                            {clients.map((client) => (
                                <Col key={client.idclientep} xs={12} md={4} lg={3} className="mb-4">
                                    <Card onClick={() => handleClientClick(client)}>
                                        <Card.Body>
                                            <Card.Title>{`${client.nombrepila} ${client.apellidopat} ${client.apellidomat}`}</Card.Title>
                                            <Card.Text>{`Teléfono: ${client.telefono}`}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
            <Footer />

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClient && (
                        <Form>
                            <Form.Group controlId="formNombrePila">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombrepila"
                                    value={selectedClient.nombrepila}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formApellidoPat" className="mt-3">
                                <Form.Label>Apellido Paterno</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidopat"
                                    value={selectedClient.apellidopat}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formApellidoMat" className="mt-3">
                                <Form.Label>Apellido Materno</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidomat"
                                    value={selectedClient.apellidomat}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCodigoPostal" className="mt-3">
                                <Form.Label>Código Postal</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="codigopostal"
                                    value={selectedClient.codigopostal}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCalle" className="mt-3">
                                <Form.Label>Calle</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="calle"
                                    value={selectedClient.calle}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formNumInt" className="mt-3">
                                <Form.Label>Número Interior</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="numint"
                                    value={selectedClient.numint}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formNumExt" className="mt-3">
                                <Form.Label>Número Exterior</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="numext"
                                    value={selectedClient.numext}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formColonia" className="mt-3">
                                <Form.Label>Colonia</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="colonia"
                                    value={selectedClient.colonia}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formTelefono" className="mt-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="telefono"
                                    value={selectedClient.telefono}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Form>
                    )}
                    <Container className='butno'></Container>
                        <Button className='bto1'  onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button className='bto2' onClick={handleDeleteClient}>
                            Eliminar
                        </Button>
                        <Button className='bto3'  onClick={handleSaveChanges}>
                            Guardar
                        </Button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProviderClients;
