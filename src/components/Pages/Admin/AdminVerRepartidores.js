import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalEdicionRepartidor from './ModalEdicionRepartidor';
import '../../Css/adminverrepo.css';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';

const AdminVerRepartidores = () => {
  const [repartidores, setRepartidores] = useState([]);
  const [camiones, setCamiones] = useState([]);
  const [paqueterias, setPaqueterias] = useState([]);
  const [repartidorEdit, setRepartidorEdit] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/ee-repartidor/')
      .then(response => setRepartidores(response.data))
      .catch(error => console.error('Error al obtener los repartidores:', error));

    axios.get('http://127.0.0.1:8000/api/ee-camion/')
      .then(response => setCamiones(response.data))
      .catch(error => console.error('Error al obtener los camiones:', error));

    axios.get('http://127.0.0.1:8000/api/ee-serviciopaqueteria/')
      .then(response => setPaqueterias(response.data))
      .catch(error => console.error('Error al obtener las paqueterías:', error));
  }, []);

  const handleEdit = (repartidor) => {
    setRepartidorEdit(repartidor);
  };

  const handleSave = (updatedRepartidor) => {
    setRepartidores(repartidores.map(r => r.idrepartidor === updatedRepartidor.idrepartidor ? updatedRepartidor : r));
  };

  return (
    <div>
      <NavBarNoMenu />
      <div className="reportes-container">
        <h1>Repartidores</h1>
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>ID Repartidor</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Camión</th>
                <th>Paquetería</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {repartidores.map((repartidor) => (
                <tr key={repartidor.idrepartidor}>
                  <td>{repartidor.idrepartidor}</td>
                  <td>{repartidor.nombre}</td>
                  <td>{repartidor.telefono}</td>
                  <td>{repartidor.camion}</td>
                  <td>{repartidor.paqueteria}</td>
                  <td><button onClick={() => handleEdit(repartidor)}>Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {repartidorEdit && (
          <ModalEdicionRepartidor
            repartidor={repartidorEdit}
            camiones={camiones}
            paqueterias={paqueterias}
            onClose={() => setRepartidorEdit(null)}
            onSave={handleSave}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminVerRepartidores;
