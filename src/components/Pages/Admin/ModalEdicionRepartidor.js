import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalEdicionRepartidor = ({ repartidor, camiones, paqueterias, onClose, onSave }) => {
  const [nombre, setNombre] = useState(repartidor.nombre || '');
  const [telefono, setTelefono] = useState(repartidor.telefono || '');
  const [camion, setCamion] = useState(repartidor.camion || '');
  const [paqueteria, setPaqueteria] = useState(repartidor.paqueteria || '');

  useEffect(() => {
    setNombre(repartidor.nombre);
    setTelefono(repartidor.telefono);
    setCamion(repartidor.camion);
    setPaqueteria(repartidor.paqueteria);
  }, [repartidor]);

  const handleSave = () => {
    const updatedRepartidor = {
      ...repartidor,
      nombre,
      telefono,
      camion,
      paqueteria
    };

    axios.put(`http://127.0.0.1:8000/api/ee-repartidor/${repartidor.idrepartidor}/`, updatedRepartidor)
      .then(response => {
        onSave(updatedRepartidor);
        onClose();
      })
      .catch(error => console.error('Error al actualizar el repartidor:', error));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Repartidor</h2>
        <label>
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <label>
          Teléfono:
          <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        </label>
        <label>
          Camión:
          <select value={camion} onChange={(e) => setCamion(e.target.value)}>
            {camiones.map((camion) => (
              <option key={camion.idcamion} value={camion.idcamion}>
                {camion.idcamion}
              </option>
            ))}
          </select>
        </label>
        <label>
          Paquetería:
          <select value={paqueteria} onChange={(e) => setPaqueteria(e.target.value)}>
            {paqueterias.map((paqueteria) => (
              <option key={paqueteria.idpaqueteria} value={paqueteria.idpaqueteria}>
                {paqueteria.idpaqueteria}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalEdicionRepartidor;
