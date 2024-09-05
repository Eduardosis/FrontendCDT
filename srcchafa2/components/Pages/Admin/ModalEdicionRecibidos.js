import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalEdicionRecibidos = ({ reporte, solicitudes, onClose, onSave }) => {
  const [cantidad, setCantidad] = useState(reporte.cantidad);
  const [fecha, setFecha] = useState(reporte.fecha);
  const [solicitudpp, setSolicitudpp] = useState(reporte.solicitudpp);

  useEffect(() => {
    setCantidad(reporte.cantidad);
    setFecha(reporte.fecha);
    setSolicitudpp(reporte.solicitudpp);
  }, [reporte]);

  const handleSave = () => {
    const updatedReporte = {
      ...reporte,
      cantidad,
      fecha,
      solicitudpp,
    };

    axios.put(`http://127.0.0.1:8000/api/agr-reporte-producto-recibidos/${reporte.idprecibidos}/`, updatedReporte)
      .then(response => {
        onSave(updatedReporte);
        onClose();
      })
      .catch(error => console.error('Error al actualizar el reporte de productos recibidos:', error));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Reporte de Productos Recibidos</h2>
        <label>
          Cantidad:
          <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        </label>
        <label>
          Fecha:
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label>
          Solicitud de Producto:
          <select value={solicitudpp} onChange={(e) => setSolicitudpp(e.target.value)}>
            <option value="">Seleccione</option>
            {solicitudes.map(solicitud => (
              <option key={solicitud.idsolicitud} value={solicitud.idsolicitud}>{solicitud.idsolicitud}</option>
            ))}
          </select>
        </label>
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default ModalEdicionRecibidos;
