import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { logout } from '../Apis/api';
import { createProvider, getEmpresas } from '../Apis/apiProviders';  // Asegúrate de tener estas funciones en tu archivo api.
import { useNavigate } from 'react-router-dom';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';
import Footer from '../Footer/Footer';

const Provider = ({ onLogout }) => {
  const [nombrepila, setNombrepila] = useState('');
  const [apellidopat, setApellidopat] = useState('');
  const [apellidomat, setApellidomat] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [usuario, setUsuario] = useState(localStorage.getItem('id')); // Obtener el idUsuario de localStorage
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const data = await getEmpresas();
        setEmpresas(data);
      } catch (error) {
        console.error('Error fetching empresas', error);
      }
    };

    fetchEmpresas();

    // Asignar idUsuario de localStorage al estado si no está ya asignado
    if (!usuario) {
      setUsuario(localStorage.getItem('id'));
    }
  }, [usuario]);

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const providerData = {
        nombrepila,
        apellidopat,
        apellidomat,
        telefono,
        empresa,
        usuario  // Usar el idUsuario del estado
      };
      const data = await createProvider(providerData);
      setSuccess('Proveedor creado exitosamente');
      setError('');
      console.log('Proveedor creado:', data);
      navigate('/provider-dashboard');
    } catch (error) {
      setError('Error al crear el proveedor');
      setSuccess('');
      console.error('Error:', error);
    }
  };

  return (
    <div className="Provider">
      <NavBarNoMenu />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <h2 className="text-center">Bienvenido Proveedor</h2>
            <Button variant="danger" onClick={handleLogout} className="mb-3">
              Logout
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <div className="login-box mt-5">
              <h2 className="text-center-h">Crear Proveedor</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNombrePila">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre de pila"
                    value={nombrepila}
                    onChange={(e) => setNombrepila(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formApellidoPat" className="mt-3">
                  <Form.Label>Apellido Paterno</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apellido Paterno"
                    value={apellidopat}
                    onChange={(e) => setApellidopat(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formApellidoMat" className="mt-3">
                  <Form.Label>Apellido Materno</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Apellido Materno"
                    value={apellidomat}
                    onChange={(e) => setApellidomat(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formTelefono" className="mt-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Teléfono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formEmpresa" className="mt-3">
                  <Form.Label>Empresa</Form.Label>
                  <Form.Control
                    as="select"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                  >
                    <option value="">Seleccione una empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.idempresa} value={empresa.idempresa}>
                        {empresa.nombre}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formIdUsuario" className="mt-3">
                  <Form.Label>ID Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={usuario}
                    readOnly
                  />
                </Form.Group>
                <Button variant="outline-purple bold-text" type="submit" className="mt-4" block>
                  Crear Proveedor
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

export default Provider;