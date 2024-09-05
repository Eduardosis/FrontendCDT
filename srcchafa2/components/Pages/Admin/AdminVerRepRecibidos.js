import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicionRecibidos from './ModalEdicionRecibidos';
import '../../Css/adminverrepo.css';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';

const AdminVerRepRecibidos = () => {
  const [recibidos, setRecibidos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);

  useEffect(() => {
    // Obtener los reportes de productos recibidos
    axios.get('http://127.0.0.1:8000/api/agr-reporte-producto-recibidos/')
      .then(response => setRecibidos(response.data))
      .catch(error => console.error('Error al obtener los reportes de productos recibidos:', error));

    // Obtener las solicitudes de productos
    axios.get('http://127.0.0.1:8000/api/agr-solicitar-producto/')
      .then(response => setSolicitudes(response.data))
      .catch(error => console.error('Error al obtener las solicitudes de productos:', error));
  }, []);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setRecibidos(recibidos.map(r => r.idprecibidos === updatedReporte.idprecibidos ? updatedReporte : r));
    setReporteEdit(null);
  };

  return (
    <div>
      <NavBarNoMenu />
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
