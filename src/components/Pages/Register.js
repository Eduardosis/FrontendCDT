import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';
import Footer from '../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Css/Register.css'; 
import { register } from '../Apis/api';
import axios from 'axios'; // Importa axios para hacer la solicitud a la API

const Register = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rolUsuario, setRolUsuario] = useState('');
    const [error, setError] = useState('');
    const [usuario, setUsuario] = useState(localStorage.getItem('id'));

    const [showModal, setShowModal] = useState(false);
    const [empresaId, setEmpresaId] = useState('');
    const [empresaNombre, setEmpresaNombre] = useState('');
    const [empresaError, setEmpresaError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        if (role === '2') {
            navigate('/provider-register'); // Redirigir a la pantalla de registro del proveedor
        } else if (role === '1') {
            navigate('/admin-dashboard'); // Redirigir a la página de administración
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const data = await register(email, password, rolUsuario);
            console.log('Registration successful', data);
            onRegister(data.role);

            localStorage.setItem('id', data.idUsuario);
            localStorage.setItem('user_role', data.role); 

            if (data.role === '2') {
                navigate('/provider-register'); // Redirigir a la pantalla de registro del proveedor
            } else {
                navigate('/'); // Redirigir a la página principal o a la adecuada según tu lógica
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error('Registration failed', error);
        }
    };

    const handleModalShow = () => setShowModal(true);
    const handleModalClose = () => {
        setShowModal(false);
        setEmpresaId('');
        setEmpresaNombre('');
        setEmpresaError('');
    };

    const handleAddCompany = async () => {
        if (empresaId.trim() === '' || empresaNombre.trim() === '') {
            setEmpresaError('Todos los campos deben ser completados.');
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/p-empresa/', {
                idempresa: empresaId.toUpperCase(), 
                nombre: empresaNombre
            });
            console.log('Empresa agregada', response.data);
            setEmpresaId('');
            setEmpresaNombre('');
            setShowModal(false);
        } catch (error) {
            setEmpresaError('Error al agregar la empresa. Inténtalo de nuevo.');
            console.error('Error al agregar la empresa', error);
        }
    };

    return (
        <div className="CrearCuenta">
            <NavBarNoMenu />
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                        <div className='create-box'>
                            <h2 className="text-center-h">Crear Cuenta</h2>
                            <Form onSubmit={handleSubmit}>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label className='bold-text'>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Introduce tu correo electrónico"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword" className="mt-3">
                                    <Form.Label className='bold-text'>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Introduce tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicConfirmPassword" className="mt-3">
                                    <Form.Label className='bold-text'>Confirma tu Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirma tu contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicRole" className="mt-3">
                                    <Form.Label className='bold-text'>Role</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={rolUsuario}
                                        onChange={(e) => setRolUsuario(e.target.value)}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="1">Administrator</option>
                                        <option value="2">Provider</option>
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="outline-purple bold-text" type="submit" className="mt-4" block>
                                    Crear Cuenta
                                </Button>
                                <Button variant="secondary" className="mt-3" block onClick={handleModalShow}>
                                    Agregar Empresa
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva Empresa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="formBasicCompanyId">
                        <Form.Label>ID de la Empresa</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce el ID de la empresa"
                            value={empresaId}
                            onChange={(e) => setEmpresaId(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicCompanyName" className="mt-3">
                        <Form.Label>Nombre de la Nueva Empresa</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Introduce el nombre de la nueva empresa"
                            value={empresaNombre}
                            onChange={(e) => setEmpresaNombre(e.target.value)}
                        />
                    </Form.Group>
                    {empresaError && <p style={{ color: 'red' }}>{empresaError}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddCompany}>
                        Guardar Empresa
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer />
        </div>
    );
};

export default Register;
