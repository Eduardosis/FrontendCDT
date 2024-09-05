import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicionRecibidos from './ModalEdicionRecibidos';
import '../../Css/adminverrepo.css';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminVerRepRecibidos = () => {
  const [recibidos, setRecibidos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);
  const [idAlmacen, setIdAlmacen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportesRecibidos = async () => {
      try {
        const userId = localStorage.getItem('id');
        const almacenResponse = await axios.get('http://127.0.0.1:8000/api/agr-almacen/');
        const almacen = almacenResponse.data.find(a => a.usuario === parseInt(userId));

        if (almacen) {
          setIdAlmacen(almacen.idalmacen);
          
          const recibidosResponse = await axios.get('http://127.0.0.1:8000/api/agr-reporte-producto-recibidos/');
          const solicitudesResponse = await axios.get('http://127.0.0.1:8000/api/agr-solicitar-producto/');
          
          const solicitudesAlmacen = solicitudesResponse.data.filter(solicitud => solicitud.almacen === almacen.idalmacen);

          const recibidosAlmacen = recibidosResponse.data.filter(recibido => 
            solicitudesAlmacen.some(solicitud => solicitud.idsolicitud === recibido.solicitudpp)
          );

          setRecibidos(recibidosAlmacen);
          setSolicitudes(solicitudesAlmacen);
        }
      } catch (error) {
        console.error('Error al obtener los reportes de productos recibidos:', error);
      }
    };

    fetchReportesRecibidos();
  }, []);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setRecibidos(recibidos.map(r => r.idprecibidos === updatedReporte.idprecibidos ? updatedReporte : r));
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
        <h1>Reportes de Productos Recibidos</h1>
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>ID Recibido</th>
                <th>Fecha</th>
                <th>Cantidad</th>
                <th>ID Solicitud</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recibidos.map((recibido) => (
                <tr key={recibido.idprecibidos}>
                  <td>{recibido.idprecibidos}</td>
                  <td>{recibido.fecha}</td>
                  <td>{recibido.cantidad}</td>
                  <td>{recibido.solicitudpp}</td>
                  <td><button onClick={() => handleEdit(recibido)}>Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reporteEdit && (
          <ModalEdicionRecibidos
            reporte={reporteEdit}
            solicitudes={solicitudes}
            onClose={() => setReporteEdit(null)}
            onSave={handleSave}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AdminVerRepRecibidos;
