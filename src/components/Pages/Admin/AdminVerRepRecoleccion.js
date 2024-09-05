import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicionRecoleccion from './ModalEdicionRecoleccion';
import '../../Css/adminverrepo.css';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReportesRecoleccion = () => {
  const [reportes, setReportes] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);
  const [idAlmacen, setIdAlmacen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const userId = localStorage.getItem('id');
        const almacenResponse = await axios.get('http://127.0.0.1:8000/api/agr-almacen/');
        const almacen = almacenResponse.data.find(a => a.usuario === parseInt(userId));

        if (almacen) {
          setIdAlmacen(almacen.idalmacen);
          const reporteResponse = await axios.get('http://127.0.0.1:8000/api/agr-reporte-recoleccion/');
          const ordenEnvioResponse = await axios.get('http://127.0.0.1:8000/api/p-ordenenvio/');
          const productoResponse = await axios.get('http://127.0.0.1:8000/api/agr-productos/');

          const ordenesAlmacen = ordenEnvioResponse.data.filter(o => {
            const producto = productoResponse.data.find(p => p.idproducto === o.producto);
            return producto && producto.almacen === almacen.idalmacen;
          });

          const reportesAlmacen = reporteResponse.data.filter(r => 
            ordenesAlmacen.some(o => o.idordenenvio === r.ordenenvio)
          );

          setReportes(reportesAlmacen);
        }
      } catch (error) {
        console.error('Error al obtener los reportes de recolección:', error);
      }
    };

    fetchReportes();
  }, []);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setReportes(reportes.map(r => r.idrecoleccionp === updatedReporte.idrecoleccionp ? updatedReporte : r));
  };
  const goToAdminDashb = () => {
    navigate('/admin');
  };

  return (
    <div>
      <NavBarAdmin />
      <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
      <div className="reportes-container">
        <h1>Reportes de Recolección</h1>
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>ID Recolección</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Paquetería</th>
                <th>Orden de Envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte) => (
                <tr key={reporte.idrecoleccionp}>
                  <td>{reporte.idrecoleccionp}</td>
                  <td>{reporte.fecha}</td>
                  <td>{reporte.hora}</td>
                  <td>{reporte.paqueteria}</td>
                  <td>{reporte.ordenenvio}</td>
                  <td><button onClick={() => handleEdit(reporte)}>Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reporteEdit && (
          <ModalEdicionRecoleccion
            reporte={reporteEdit}
            onClose={() => setReporteEdit(null)}
            onSave={handleSave}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ReportesRecoleccion;
