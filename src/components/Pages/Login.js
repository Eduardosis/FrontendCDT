import React, { useState } from 'react'; // Importar React y el hook useState

import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';
import Footer from '../Footer/Footer'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Css/Login.css'; 

import { login } from '../Apis/api'; // Importar la función login desde el archivo api.js

const Login = ({ onLogin }) => { // Componente funcional Login que recibe onLogin como prop
    const [email, setEmail] = useState(''); // Declarar el estado email y su función para actualizarlo
    const [password, setPassword] = useState(''); // Declarar el estado password y su función para actualizarlo
    const [error, setError] = useState(''); // Declarar el estado error

    const handleSubmit = async (e) => { // Función para manejar el envío del formulario
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario (recargar la página)
        try {
            const data = await login(email, password); // Llamar a la función login con el email y password ingresados
            console.log('Login successful', data); // Si el inicio de sesión es exitoso, mostrar un mensaje en la consola
            onLogin(); // Llamar a la función onLogin para manejar el inicio de sesión exitoso
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.'); // Si ocurre un error, actualizar el estado de error
            console.error('Login failed', error);
            console.error('Login failed', error); // Si ocurre un error, mostrar un mensaje de error en la consola
        }
    };

    return (
      <div className="IniciarSesion">
        <NavBarNoMenu/>
        <Container className="mt-5">
          <Row className="justify-content-center">
            <Col xs={12} md={6}>
              <div className="login-box mt-5">
                <h2 className="text-center-h">Iniciar Sesion</h2>
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
  
                  <Button variant="outline-purple bold-text" type="submit" className="mt-4" block="true">
                    Iniciar Sesion
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
  
export default Login;