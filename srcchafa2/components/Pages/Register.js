import React, { useState } from 
'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';
import Footer from '../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../Css/Register.css'; 
import { register } from '../Apis/api';

const Register = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rolUsuario, setRolUsuario] = useState('');
    const [error, setError] = useState('');
    const [usuario, setUsuario] = useState(localStorage.getItem('id'));
    const navigate = useNavigate();

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
            setUsuario(data.idUsuario);
            
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
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
          
        </div>
      );
    };
    
    export default Register;
