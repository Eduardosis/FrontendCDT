import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Css/ProfileProvider.css';

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Cambio de Contraseña Exitoso
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Su nueva contraseña es:</h4>
                <p>{props.newPassword}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
}

const AdminChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [modalShow, setModalShow] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Las nuevas contraseñas no coinciden.');
            return;
        }
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('http://127.0.0.1:8000/api/user/change-password/', {
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirm: confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setError('');
            console.log('Password changed successfully');
            setModalShow(true);
        } catch (error) {
            setError('Error al actualizar la contraseña. Inténtalo de nuevo.');
            console.error('Error:', error);
            setModalShow(false);
        }
    };

    const handleCloseModal = () => {
        setModalShow(false);
        navigate('/admin-profile');
    };

    return (
        <div className="ChangePassword">
            <NavBarAdmin />
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                        <div className="change-password-box">
                            <h2 className="text-center">Cambiar Contraseña</h2>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formOldPassword">
                                    <Form.Label>Contraseña Antigua</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Introduce tu contraseña antigua"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formNewPassword" className="mt-3">
                                    <Form.Label>Nueva Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Introduce tu nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formConfirmPassword" className="mt-3">
                                    <Form.Label>Confirma Nueva Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirma tu nueva contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </Form.Group>
                                <Button variant="outline-purple bold-text" type="submit" className="mt-4" block>
                                    Actualizar Contraseña
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={handleCloseModal}
                newPassword={newPassword}
            />
        </div>
    );
};

export default AdminChangePassword;
