import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicion from './ModalEdicionRepEnvio'; 
import '../../Css/adminverrepo.css';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';

const ReporteEnvio = () => {
  const [reportes, setReportes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [ordenesEnvio, setOrdenesEnvio] = useState([]);
  const [paqueterias, setPaqueterias] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);

  useEffect(() => {
    // Obtener los reportes de envío
    axios.get('http://127.0.0.1:8000/api/agr-reporteenvio/')
      .then(response => setReportes(response.data))
      .catch(error => console.error('Error al obtener los reportes de envío:', error));

    // Obtener los almacenes
    axios.get('http://127.0.0.1:8000/api/agr-almacen/')
      .then(response => setAlmacenes(response.data))
      .catch(error => console.error('Error al obtener los almacenes:', error));

    // Obtener las órdenes de envío
    axios.get('http://127.0.0.1:8000/api/p-ordenenvio/')
      .then(response => setOrdenesEnvio(response.data))
      .catch(error => console.error('Error al obtener las órdenes de envío:', error));

    // Obtener los envíos
    axios.get('http://127.0.0.1:8000/api/ee-envio/')
      .then(response => setPaqueterias(response.data))
      .catch(error => console.error('Error al obtener los envíos:', error));
  }, []);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setReportes(reportes.map(r => r.idreporteenvio === updatedReporte.idreporteenvio ? updatedReporte : r));
    setReporteEdit(null);
  };

  return (
    <div>
      <NavBarNoMenu />
      <div className="reportes-container">
        <h1>Reportes de Envío</h1>
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>ID Reporte</th>
                <th>Descripción</th>
                <th>Estatus</th>
                <th>Almacén</th>
                <th>Orden Envío</th>
                <th>Envío</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((reporte) => (
                <tr key={reporte.idreporteenv}>
                  <td>{reporte.idreporteenv}</td>
                  <td>{reporte.descripcion}</td>
                  <td>{reporte.estatus}</td>
                  <td>{reporte.almacen}</td>
                  <td>{reporte.ordenenvio}</td>
                  <td>{reporte.envio}</td>
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
            ordenesEnvio={ordenesEnvio}
            paqueterias={paqueterias}
            onClose={() => setReporteEdit(null)}
            onSave={handleSave}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ReporteEnvio;
