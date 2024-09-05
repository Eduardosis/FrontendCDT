import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Css/adminverrepo.css';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';

const AdminAgregarRepartidor = () => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [camion, setCamion] = useState('');
  const [paqueteria, setPaqueteria] = useState('');
  const [camiones, setCamiones] = useState([]);
  const [paqueterias, setPaqueterias] = useState([]);

  useEffect(() => {
    // Obtener los camiones
    axios.get('http://127.0.0.1:8000/api/ee-camion/')
      .then(response => setCamiones(response.data))
      .catch(error => console.error('Error al obtener los camiones:', error));

    // Obtener las paqueterías
    axios.get('http://127.0.0.1:8000/api/ee-serviciopaqueteria/')
      .then(response => setPaqueterias(response.data))
      .catch(error => console.error('Error al obtener las paqueterías:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newRepartidor = {
      nombre,
      telefono,
      camion,
      paqueteria,
    };

    axios.post('http://127.0.0.1:8000/api/ee-repartidor/', newRepartidor)
      .then(response => {
        console.log('Repartidor agregado:', response.data);
        setNombre('');
        setTelefono('');
        setCamion('');
        setPaqueteria('');
      })
      .catch(error => console.error('Error al agregar el repartidor:', error));
  };

  return (
    <div>
      <NavBarNoMenu />
      <div className="form-container">
        <h1>Agregar Repartidor</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </label>
          <label>
            Teléfono:
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required maxLength="10" />
          </label>
          <label>
            Camión:
            <select value={camion} onChange={(e) => setCamion(e.target.value)} required>
              <option value="">Seleccionar Camión</option>
              {camiones.map(camion => (
                <option key={camion.idcamion} value={camion.idcamion}>
                  {camion.idcamion}
                </option>
              ))}
            </select>
          </label>
          <label>
            Paquetería:
            <select value={paqueteria} onChange={(e) => setPaqueteria(e.target.value)} required>
              <option value="">Seleccionar Paquetería</option>
              {paqueterias.map(paqueteria => (
                <option key={paqueteria.idserviciopaqueteria} value={paqueteria.idserviciopaqueteria}>
                  {paqueteria.idpaqueteria}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Agregar Repartidor</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default AdminAgregarRepartidor;
