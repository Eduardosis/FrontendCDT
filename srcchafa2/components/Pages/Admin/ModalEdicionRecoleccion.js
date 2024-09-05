import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalEdicionRecoleccion = ({ reporte, onClose, onSave }) => {
  const [fecha, setFecha] = useState(reporte.fecha || '');
  const [hora, setHora] = useState(reporte.hora || '');
  const [paqueteria, setPaqueteria] = useState(reporte.paqueteria || '');
  const [ordenenvio, setOrdenenvio] = useState(reporte.ordenenvio || '');
  const [paqueterias, setPaqueterias] = useState([]);
  const [ordenes, setOrdenes] = useState([]);

  useEffect(() => {
    // Obtener la lista de paqueterías
    axios.get('http://127.0.0.1:8000/api/ee-serviciopaqueteria/')
      .then(response => {
        setPaqueterias(response.data);
      })
      .catch(error => console.error('Error al obtener las paqueterías:', error));

    // Obtener la lista de órdenes de envío
    axios.get('http://127.0.0.1:8000/api/p-ordenenvio/')
      .then(response => {
        setOrdenes(response.data);
      })
      .catch(error => console.error('Error al obtener las órdenes de envío:', error));
  }, []);

  const handleSave = () => {
    const updatedReporte = {
      ...reporte,
      fecha,
      hora,
      paqueteria,
      ordenenvio,
    };

    axios.put(`http://127.0.0.1:8000/api/agr-reporte-recoleccion/${reporte.idrecoleccionp}/`, updatedReporte)
      .then(response => {
        onSave(updatedReporte);
        onClose();
      })
      .catch(error => console.error('Error al actualizar el reporte de recolección:', error));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Reporte de Recolección</h2>
        <label>
          Fecha:
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label>
          Hora:
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        </label>
        <label>
          Paquetería:
          <select value={paqueteria} onChange={(e) => setPaqueteria(e.target.value)}>
            <option value="">Selecciona una paquetería</option>
            {paqueterias.length > 0 ? (
              paqueterias.map(p => (
                <option key={p.idpaqueteria} value={p.idpaqueteria}>{p.idpaqueteria}</option>
              ))
            ) : (
              <option value="">No hay paqueterías disponibles</option>
            )}
          </select>
        </label>
        <label>
          Orden de Envío:
          <select value={ordenenvio} onChange={(e) => setOrdenenvio(e.target.value)}>
            <option value="">Selecciona una orden de envío</option>
            {ordenes.length > 0 ? (
              ordenes.map(o => (
                <option key={o.idordenenvio} value={o.idordenenvio}>{o.idordenenvio}</option>
              ))
            ) : (
              <option value="">No hay órdenes de envío disponibles</option>
            )}
          </select>
        </label>
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalEdicionRecoleccion;
