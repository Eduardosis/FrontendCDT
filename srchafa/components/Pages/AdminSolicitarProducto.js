import React, { useState, useEffect } from 'react';
import '../Css/Proveedores.css';
import axios from 'axios';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';

const SolicitarProducto = () => {
  const [proveedores, setProveedores] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [selectedAlmacen, setSelectedAlmacen] = useState('');
  const [selectedProducto, setSelectedProducto] = useState('');
  const [fechasol, setFechasol] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch proveedores
    axios.get('http://127.0.0.1:8000/api/p-proveedor/')
      .then(response => {
        setProveedores(response.data);
      })
      .catch(error => {
        console.error('Error al obtener proveedores:', error);
      });

    // Fetch almacenes
    axios.get('http://127.0.0.1:8000/api/agr-almacen/')
      .then(response => {
        setAlmacenes(response.data);
      })
      .catch(error => {
        console.error('Error al obtener almacenes:', error);
      });

    // Fetch productos
    axios.get('http://127.0.0.1:8000/api/agr-productos/')
      .then(response => {
        setProductos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      proveedor: selectedProveedor,
      almacen: selectedAlmacen,
      producto: selectedProducto,
      fechasol,
      cantidad: parseInt(cantidad),
    };

    axios.post('http://127.0.0.1:8000/api/agr-solicitar-producto/', data)
      .then(response => {
        console.log('Solicitud enviada:', response.data);
        setMessage('Solicitud creada exitosamente');
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        setMessage('Error al crear la solicitud');
      });
  };

  return (
    <div>
      <NavBarNoMenu />
      <form className="order-form" onSubmit={handleSubmit}>
        <h1>Solicitar Producto</h1>
        <div className="form-row">
          <div className="form-group">
            <label>Proveedor:</label>
            <select 
              name="proveedor" 
              value={selectedProveedor} 
              onChange={(e) => setSelectedProveedor(e.target.value)}
              required
            >
              <option value="">Selecciona un proveedor</option>
              {proveedores.map(prov => (
                <option key={prov.idproveedor} value={prov.idproveedor}>
                  {prov.nombrepila}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Almacen:</label>
            <select 
              name="almacen" 
              value={selectedAlmacen} 
              onChange={(e) => setSelectedAlmacen(e.target.value)}
              required
            >
              <option value="">Selecciona un almacen</option>
              {almacenes.map(alma => (
                <option key={alma.idalmacen} value={alma.idalmacen}>
                  {alma.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Producto:</label>
            <select 
              name="producto" 
              value={selectedProducto} 
              onChange={(e) => setSelectedProducto(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {productos.map(prod => (
                <option key={prod.idproducto} value={prod.idproducto}>
                  {prod.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Cantidad:</label>
            <input
              type="number"
              name="cantidad"
              placeholder="Introduce la cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de Solicitud:</label>
            <input
              type="date"
              className="fechasol"
              value={fechasol}
              onChange={(e) => setFechasol(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit">Enviar Solicitud</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SolicitarProducto;
