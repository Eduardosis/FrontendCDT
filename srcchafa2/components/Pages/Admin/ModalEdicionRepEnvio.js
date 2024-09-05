import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Css/adminverrepo.css';

const ModalEdicionRepEnvio = ({ reporte, almacenes, ordenesEnvio, paqueterias, onClose, onSave }) => {
  const [descripcion, setDescripcion] = useState(reporte.descripcion);
  const [estatus, setEstatus] = useState(reporte.estatus);
  const [almacen, setAlmacen] = useState(reporte.almacen);
  const [ordenenvio, setOrdenenvio] = useState(reporte.ordenenvio);
  const [envio, setEnvio] = useState(reporte.envio);

  useEffect(() => {
    setDescripcion(reporte.descripcion);
    setEstatus(reporte.estatus);
    setAlmacen(reporte.almacen);
    setOrdenenvio(reporte.ordenenvio);
    setEnvio(reporte.envio);
  }, [reporte]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://127.0.0.1:8000/api/agr-reporteenvio/${reporte.idreporteenv}/`, {
      descripcion,
      estatus,
      almacen,
      ordenenvio,
      envio
    })
    .then(response => {
      onSave(response.data);
      onClose();
    })
    .catch(error => console.error('Error al actualizar el reporte de envío:', error));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Reporte de Envío</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Descripción:
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </label>
          <label>
            Estatus:
            <input
              type="text"
              value={estatus}
              onChange={(e) => setEstatus(e.target.value)}
            />
          </label>
          <label>
            Almacén:
            <select
              value={almacen}
              onChange={(e) => setAlmacen(e.target.value)}
            >
              <option value="">Seleccione</option>
              {almacenes.map(a => (
                <option key={a.idalmacen} value={a.idalmacen}>{a.idalmacen}</option>
              ))}
            </select>
          </label>
          <label>
            Orden Envío:
            <select
              value={ordenenvio}
              onChange={(e) => setOrdenenvio(e.target.value)}
            >
              <option value="">Seleccione</option>
              {ordenesEnvio.map(o => (
                <option key={o.idordenenvio} value={o.idordenenvio}>{o.idordenenvio}</option>
              ))}
            </select>
          </label>
          <label>
            Envío:
            <select
              value={envio}
              onChange={(e) => setEnvio(e.target.value)}
            >
              <option value="">Seleccione</option>
              {paqueterias.map(p => (
                <option key={p.idenvio} value={p.idenvio}>{p.idenvio}</option>
              ))}
            </select>
          </label>
          <button type="submit" style={{ backgroundColor: 'purple', color: 'white' }}>Guardar</button>
          <button type="button" className="cancelar" onClick={onClose} style={{ backgroundColor: 'purple', color: 'white' }}>Cerrar</button>
        </form>
      </div>
    </div>
  );
}

export default ModalEdicionRepEnvio;
