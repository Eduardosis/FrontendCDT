import React, { useState, useEffect } from 'react';
import '../../Css/SolicitarProducto.css';
import axios from 'axios';
import NavBar from '../../NavBar/NavBarAdmin';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Footer from '../../Footer/Footer';

const SolicitarProducto = () => {
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState('');
  const [selectedProducto, setSelectedProducto] = useState('');
  const [fechasol, setFechasol] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [idAlmacen, setIdAlmacen] = useState('');

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  useEffect(() => {
    const usuarioId = localStorage.getItem('id'); // Obtener el ID del usuario desde localStorage

    // Obtener almacén del usuario
    axios.get('http://127.0.0.1:8000/api/agr-almacen/')
      .then(response => {
        const almacenUsuario = response.data.find(almacen => almacen.usuario === parseInt(usuarioId));
        if (almacenUsuario) {
          setIdAlmacen(almacenUsuario.idalmacen); // Guardar el idalmacen en el estado

          const idAlmacen = almacenUsuario.idalmacen;

          // Obtener proveedores asociados al almacén
          axios.get(`http://127.0.0.1:8000/api/agr-almacen-proveedor/?almacen=${idAlmacen}`)
            .then(response => {
              const proveedorIds = response.data.map(item => item.proveedor);

              // Obtener todos los proveedores y filtrar en el frontend
              axios.get('http://127.0.0.1:8000/api/p-proveedor/')
                .then(response => {
                  setProveedores(response.data.filter(prov => proveedorIds.includes(prov.idproveedor)));
                })
                .catch(error => {
                  console.error('Error al obtener proveedores:', error);
                });
            })
            .catch(error => {
              console.error('Error al obtener almacenes-proveedores:', error);
            });

          // Obtener productos
          axios.get('http://127.0.0.1:8000/api/agr-productos/')
            .then(response => {
              setProductos(response.data);
            })
            .catch(error => {
              console.error('Error al obtener productos:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error al obtener almacenes:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedProveedor) {
      // Filtrar productos según el proveedor seleccionado
      axios.get('http://127.0.0.1:8000/api/agr-producto-proveedor/')
        .then(response => {
          const productosIds = response.data
            .filter(item => item.proveedor === parseInt(selectedProveedor))
            .map(item => item.producto);
          setProductosFiltrados(productos.filter(prod => productosIds.includes(prod.idproducto)));
        })
        .catch(error => {
          console.error('Error al obtener productos-proveedores:', error);
        });
    }
  }, [selectedProveedor, productos]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      proveedor: selectedProveedor,
      almacen: idAlmacen, // Usar el idAlmacen del estado
      producto: selectedProducto,
      fechasol,
      cantidad: parseInt(cantidad),
    };

    axios.post('http://127.0.0.1:8000/api/agr-solicitar-producto/', data)
      .then(response => {
        console.log('Solicitud enviada:', response.data);
        setMessage('Solicitud enviada exitosamente.');
        setError('');
        setTimeout(() => {
          window.location.reload(); // Recargar la página después de 2 segundos
        }, 2000);
      })
      .catch(error => {
        console.error('Error al enviar la solicitud:', error);
        setMessage('');
        setError('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
      });
  };

  return (
    <div>
      <NavBar />
      <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
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
            <label>Producto:</label>
            <select
              name="producto"
              value={selectedProducto}
              onChange={(e) => setSelectedProducto(e.target.value)}
              required
            >
              <option value="">Selecciona un producto</option>
              {productosFiltrados.map(prod => (
                <option key={prod.idproducto} value={prod.idproducto}>
                  {prod.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
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
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <Footer />
    </div>
  );
};

export default SolicitarProducto;
