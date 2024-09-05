import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicion from './ModalEdicionRProduc'; // Asegúrate de que este archivo existe
import '../../Css/adminverrepo.css';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';

const Reportes = () => {
  const [fallas, setFallas] = useState([]);
  const [reporteEdit, setReporteEdit] = useState(null);

  useEffect(() => {
    // Obtener los reportes de productos con fallas
    axios.get('http://127.0.0.1:8000/api/agr-reporteproducto-falla/')
      .then(response => setFallas(response.data))
      .catch(error => console.error('Error al obtener los reportes de fallas:', error));
  }, []);

  const handleEdit = (reporte) => {
    setReporteEdit(reporte);
  };

  const handleSave = (updatedReporte) => {
    setFallas(fallas.map(f => f.idpfallas === updatedReporte.idpfallas ? updatedReporte : f));
    setReporteEdit(null);
  };

  return (
    <div>
      <NavBarNoMenu />
      <div className="reportes-container">
        <h1>Reportes de Productos Faltantes</h1>
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
