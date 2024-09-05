import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicion from './ModalEdicionRProduc'; // Asegúrate de que este archivo existe
import '../../Css/adminverrepo.css';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Reportes = () => {
  const [fallas, setFallas] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);
  const [idAlmacen, setIdAlmacen] = useState('');
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlmacenYProductos = async () => {
      try {
        const userId = localStorage.getItem('id');
        
        // Obtener el almacén del usuario
        const almacenResponse = await axios.get('http://127.0.0.1:8000/api/agr-almacen/');
        const almacen = almacenResponse.data.find(a => a.usuario === parseInt(userId));
        if (almacen) {
          setIdAlmacen(almacen.idalmacen);

          // Obtener productos asociados al almacén
          const productosResponse = await axios.get('http://127.0.0.1:8000/api/agr-productos/');
          const productosAlmacen = productosResponse.data.filter(p => p.almacen === almacen.idalmacen);
          setProductos(productosAlmacen);
        } else {
          console.error('No se encontró el almacén para el usuario.');
        }
      } catch (error) {
        console.error('Error fetching almacen y productos:', error);
      }
    };

    fetchAlmacenYProductos();
  }, []);

  useEffect(() => {
    // Obtener los reportes de productos con fallas
    axios.get('http://127.0.0.1:8000/api/agr-reporteproducto-falla/')
      .then(response => {
        // Filtrar reportes para que solo se muestren los del almacén del usuario
        const productosIds = productos.map(p => p.idproducto);
        const fallasAlmacen = response.data.filter(f => productosIds.includes(f.producto));
        setFallas(fallasAlmacen);
      })
      .catch(error => console.error('Error al obtener los reportes de fallas:', error));
  }, [productos]);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setFallas(fallas.map(f => f.idpfallas === updatedReporte.idpfallas ? updatedReporte : f));
    setReporteEdit(null);
  };

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  return (
    <div>
      <NavBarAdmin />
      <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
      <div className="reportes-container">
        <h1>Reportes de Fallas</h1>
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>ID Falla</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>Detalles</th>
                <th>Producto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {fallas.map((falla) => (
                <tr key={falla.idpfallas}>
                  <td>{falla.idpfallas}</td>
                  <td>{falla.fecha}</td>
                  <td>{falla.cantidad}</td>
                  <td>{falla.detalles}</td>
                  <td>{falla.producto}</td>
                  <td><button onClick={() => handleEdit(falla)}>Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reporteEdit && (
          <ModalEdicion
            reporte={reporteEdit}
            onClose={() => setReporteEdit(null)}
            onSave={handleSave}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Reportes;
