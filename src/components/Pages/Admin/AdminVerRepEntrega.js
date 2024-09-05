import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicion from './ModalEdicionRepEntrega'; // Asegúrate de tener este archivo
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReporteEntrega = () => {
  const [reportes, setReportes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [entregas, setEntregas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);
  const [idAlmacen, setIdAlmacen] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const usuarioId = localStorage.getItem('id');

    axios.get('http://127.0.0.1:8000/api/agr-almacen/')
      .then(response => {
        setAlmacenes(response.data);

        // Obtener el idalmacen del usuario
        const almacenUsuario = response.data.find(almacen => almacen.usuario === parseInt(usuarioId));
        if (almacenUsuario) {
          setIdAlmacen(almacenUsuario.idalmacen);
        }
      })
      .catch(error => console.error('Error al obtener los almacenes:', error));

    // Obtener las entregas
    axios.get('http://127.0.0.1:8000/api/ee-entrega/')
      .then(response => {
        setEntregas(response.data);
      })
      .catch(error => console.error('Error al obtener las entregas:', error));

    // Obtener las órdenes de envío
    axios.get('http://127.0.0.1/api/p-ordenenvio/')
      .then(response => {
        setOrdenes(response.data);
      })
      .catch(error => console.error('Error al obtener las órdenes de envío:', error));
  }, []);

  useEffect(() => {
    if (idAlmacen) {
      axios.get('http://127.0.0.1:8000/api/agr-reporteentrega/')
        .then(response => {
          // Filtrar los reportes por idalmacen
          const reportesFiltrados = response.data.filter(reporte => reporte.almacen === idAlmacen);
          setReportes(reportesFiltrados);
        })
        .catch(error => console.error('Error al obtener los reportes de entrega:', error));
    }
  }, [idAlmacen]);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setReportes(reportes.map(r => r.idreportent === updatedReporte.idreportent ? updatedReporte : r));
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
        <h1>Reportes de Entrega</h1>
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>ID Reporte</th>
                <th>Descripción</th>
                <th>Estatus</th>
                <th>Almacén</th>
                <th>Entrega</th>
                <th>Orden de Envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte) => (
                <tr key={reporte.idreportent}>
                  <td>{reporte.idreportent}</td>
                  <td>{reporte.descripcion}</td>
                  <td>{reporte.estatus}</td>
                  <td>{reporte.almacen}</td>
                  <td>{reporte.entrega}</td>
                  <td>{reporte.ordenenvio}</td> 
                  <td>
                    <button onClick={() => handleEdit(reporte)}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reporteEdit && (
          <ModalEdicion
            reporte={reporteEdit}
            almacenes={almacenes}
            entregas={entregas}
            ordenes={ordenes}
            onClose={() => setReporteEdit(null)}
            onSave={handleSave}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ReporteEntrega;
