import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicionRecoleccion from './ModalEdicionRecoleccion';
import '../../Css/adminverrepo.css';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';

const ReportesRecoleccion = () => {
  const [reportes, setReportes] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);

  useEffect(() => {
    // Obtener los reportes de recolección
    axios.get('http://127.0.0.1:8000/api/agr-reporte-recoleccion/')
      .then(response => setReportes(response.data))
      .catch(error => console.error('Error al obtener los reportes de recolección:', error));
  }, []);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setReportes(reportes.map(r => r.idrecoleccionp === updatedReporte.idrecoleccionp ? updatedReporte : r));
  };

  return (
    <div>
      <NavBarNoMenu />
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
