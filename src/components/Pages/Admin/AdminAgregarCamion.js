import React, { useState } from 'react';
import axios from 'axios';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';

const AdminAgregarCamion = () => {
  const [placas, setPlacas] = useState('');
  const [capacidadCarga, setCapacidadCarga] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoCamion = {
      placas,
      capacidadcarga: parseInt(capacidadCarga),
    };

    axios.post('http://127.0.0.1:8000/api/ee-camion/', nuevoCamion)
      .then(response => {
        alert('Camión agregado exitosamente');
        setPlacas('');
        setCapacidadCarga('');
      })
      .catch(error => {
        console.error('Error al agregar el camión:', error);
        alert('Hubo un error al agregar el camión. Por favor, inténtalo de nuevo.');
      });
  };

  return (
    <div>
      <NavBarNoMenu />
      <div className="form-container">
        <h1>Agregar Camión</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="placas">Placas:</label>
            <input
              type="text"
              id="placas"
              value={placas}
              onChange={(e) => setPlacas(e.target.value)}
              required
              maxLength={7}
            />
          </div>
          <div className="form-group">
            <label htmlFor="capacidadCarga">Capacidad de Carga (kg):</label>
            <input
              type="number"
              id="capacidadCarga"
              value={capacidadCarga}
              onChange={(e) => setCapacidadCarga(e.target.value)}
              required
            />
          </div>
          <button type="submit">Agregar Camión</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminAgregarCamion;
