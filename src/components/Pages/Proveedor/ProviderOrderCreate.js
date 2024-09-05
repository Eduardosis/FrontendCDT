import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaArrowLeft } from 'react-icons/fa';
import '../../Css/ProviderOrderCreate.css';


const ProviderOrderCreate = () => {
    const [productoproveedor, setProductoProveedor] = useState('');
    const [cliente, setCliente] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [fecha, setFecha] = useState('');
    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const providerId = localStorage.getItem('provider_id');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseClientes = await fetch('http://127.0.0.1:8000/api/p-clientesp/');
                const dataClientes = await responseClientes.json();
                const filteredClientes = dataClientes.filter(cliente => cliente.proveedor === parseInt(providerId));
                setClientes(filteredClientes);

                const responseProductos = await fetch('http://127.0.0.1:8000/api/agr-producto-proveedor/');
                const dataProductos = await responseProductos.json();
                const filteredProductos = dataProductos.filter(prodProv => prodProv.proveedor === parseInt(providerId));

                const productosConDetalles = await Promise.all(filteredProductos.map(async (prodProv) => {
                    const responseProducto = await fetch(`http://127.0.0.1:8000/api/agr-productos/${prodProv.producto}/`);
                    const dataProducto = await responseProducto.json();
                    return {
                        id: prodProv.producto,
                        name: dataProducto.nombre,
                    };
                }));

                setProductos(productosConDetalles);
            } catch (error) {
                setError("Error al cargar los datos");
            }
        };

        fetchData();
    }, [providerId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nuevaOrden = {
            fecha: fecha,
            cantidad: cantidad,
            destinatario: cliente,
            proveedor: providerId,
            producto: productoproveedor,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/p-ordenenvio/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaOrden),
            });

            if (response.ok) {
                setSuccess('Orden de envío creada exitosamente');
                setError('');
                // Reset form fields
                setProductoProveedor('');
                setCliente('');
                setCantidad('');
                setFecha('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al crear la orden de envío');
                setSuccess('');
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            setSuccess('');
        }
    };

    const handleBack = () => {
        navigate('/provider-dashboard');
    };

    return (
        <div className="CrearOrden">
            <NavBar />
            <FaArrowLeft className="back-arrow3" size={30} onClick={handleBack} />
            <Container className="pt-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        <div className='create-box'>
                            <h2 className="text-center-h">Crear Orden de Envío</h2>
                            {success && <Alert variant="success">{success}</Alert>}
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicProducto">
                                    <Form.Label className='bold-text'>Producto</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={productoproveedor}
                                        onChange={(e) => setProductoProveedor(e.target.value)}
                                    >
                                        <option value="">Seleccione un producto</option>
                                        {productos.map((prod) => (
                                            <option key={prod.id} value={prod.id}>
                                                {prod.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="formBasicCliente" className="mt-3">
                                    <Form.Label className='bold-text'>Cliente</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={cliente}
                                        onChange={(e) => setCliente(e.target.value)}
                                    >
                                        <option value="">Seleccione un cliente</option>
                                        {clientes.map((cli) => (
                                            <option key={cli.idclientep} value={cli.idclientep}>
                                                {cli.nombrepila} {cli.apellidopat} {cli.apellidomat}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="formBasicCantidad" className="mt-3">
                                    <Form.Label className='bold-text'>Cantidad</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Introduce la cantidad"
                                        value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formBasicFecha" className="mt-3">
                                    <Form.Label className='bold-text'>Fecha</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={fecha}
                                        onChange={(e) => setFecha(e.target.value)}
                                    />
                                </Form.Group>

                                <Button variant="outline-purple bold-text" type="submit" className="mt-4" block>
                                    Crear Orden de Envío
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

export default ProviderOrderCreate;
