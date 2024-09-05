import React, { useState, useEffect } from 'react';
import '../../Css/agrproductform.css';
import axios from 'axios';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AgrProductoForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idproducto: '',
    nombre: '',
    stock: '',
    almacen: '',
    proveedor: '',
    link: '',
    peso: '',
    estado: '',
    tamaño: '',
    modelo: '',
    marca: '',
    precio: ''
  });

  const [almacenes, setAlmacenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const almacenesResponse = await axios.get('http://127.0.0.1:8000/api/agr-almacen/');
        setAlmacenes(almacenesResponse.data);

        const proveedoresResponse = await axios.get('http://127.0.0.1:8000/api/p-proveedor/');
        setProveedores(proveedoresResponse.data);
      } catch (error) {
        console.error('Error al obtener almacenes o proveedores:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productoResponse = await axios.post('http://127.0.0.1:8000/api/agr-productos/', {
        idproducto: formData.idproducto,
        nombre: formData.nombre,
        stock: formData.stock,
        almacen: formData.almacen
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const relacionResponse = await axios.post('http://127.0.0.1:8000/api/agr-producto-proveedor/', {
        producto: productoResponse.data.idproducto,
        proveedor: formData.proveedor
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const detalleResponse = await axios.post('http://127.0.0.1:8000/api/agr-detalleproductos/', {
        producto: productoResponse.data.idproducto,
        peso: formData.peso,
        estado: formData.estado,
        tamaño: formData.tamaño,
        modelo: formData.modelo,
        marca: formData.marca,
        precio: formData.precio
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const fotoResponse = await axios.post('http://127.0.0.1:8000/api/agr-fotos/', {
        producto: productoResponse.data.idproducto,
        link: formData.link
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Producto agregado, relación creada y detalles añadidos:', detalleResponse.data);
      setFormData({
        idproducto: '',
        nombre: '',
        stock: '',
        almacen: '',
        proveedor: '',
        link: '',
        peso: '',
        estado: '',
        tamaño: '',
        modelo: '',
        marca: '',
        precio: ''
      });
    } catch (error) {
      if (error.response) {
        console.error('Error al agregar producto o crear relación:', error.response.data);
      } else if (error.request) {
        console.error('Error en la solicitud:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  return (
    <>
      <NavBarAdmin />
      <FaArrowLeft className="back-arrow-apf" size={30} onClick={goToAdminDashb} />
      <div className="container-apf">
        <div className="form-container-apf">
          <h1>Agregar Producto</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-row-apf">
              <div className="form-group-apf">
                <label>ID Producto:</label>
                <input
                  type="text"
                  name="idproducto"
                  value={formData.idproducto}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-apf">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row-apf">
              <div className="form-group-apf">
                <label>Stock:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-apf">
                <label>Almacen:</label>
                <select
                  name="almacen"
                  value={formData.almacen}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un almacén</option>
                  {almacenes.map((almacen) => (
                    <option key={almacen.idalmacen} value={almacen.idalmacen}>
                      {almacen.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row-apf">
              <div className="form-group-apf">
                <label>Proveedor:</label>
                <select
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un proveedor</option>
                  {proveedores.map((proveedor) => (
                    <option key={proveedor.idproveedor} value={proveedor.idproveedor}>
                      {proveedor.nombrepila} {proveedor.apellidopat} {proveedor.apellidomat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-apf">
                <label>Foto:</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row-apf">
              <div className="form-group-apf">
                <label>Peso:</label>
                <input
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-apf">
                <label>Estado:</label>
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row-apf">
              <div className="form-group-apf">
                <label>Tamaño:</label>
                <input
                  type="text"
                  name="tamaño"
                  value={formData.tamaño}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-apf">
                <label>Modelo:</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row-apf">
              <div className="form-group-apf">
                <label>Marca:</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-apf">
                <label>Precio:</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-button-apf">Agregar Producto</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AgrProductoForm;
