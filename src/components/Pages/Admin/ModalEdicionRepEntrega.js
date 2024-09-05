import React, { useState, useEffect } from 'react';
import '../../Css/modalStyles.css'; 

const ModalEdicionRepEntrega = ({ reporte, almacenes, entregas, ordenes, onClose, onSave }) => {
  const [descripcion, setDescripcion] = useState(reporte.descripcion);
  const [estatus, setEstatus] = useState(reporte.estatus);
  const [almacen, setAlmacen] = useState(reporte.almacen);
  const [entrega, setEntrega] = useState(reporte.entrega);
  const [idordenenvio, setIdordenenvio] = useState(reporte.idordenenvio);

  useEffect(() => {
    setDescripcion(reporte.descripcion);
    setEstatus(reporte.estatus);
    setAlmacen(reporte.almacen);
    setEntrega(reporte.entrega);
    setIdordenenvio(reporte.idordenenvio);
  }, [reporte]);

  const handleSave = () => {
    const updatedReporte = {
      ...reporte,
      descripcion,
      estatus,
      almacen,
      entrega,
      idordenenvio
    };
    onSave(updatedReporte);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Reporte de Entrega</h2>
        <label>Descripción</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <label>Estatus</label>
        <input
          type="text"
          value={estatus}
          onChange={(e) => setEstatus(e.target.value)}
        />
        <label>Almacén</label>
        <select
          value={almacen}
          onChange={(e) => setAlmacen(e.target.value)}
        >
          <option value="">Seleccionar Almacén</option>
          {almacenes.map((item) => (
            <option key={item.idalmacen} value={item.idalmacen}>
              {item.idalmacen}
            </option>
          ))}
        </select>
        <label>Entrega</label>
        <select
          value={entrega}
          onChange={(e) => setEntrega(e.target.value)}
        >
          <option value="">Seleccionar Entrega</option>
          {entregas.map((item) => (
            <option key={item.identrega} value={item.identrega}>
              {item.identrega}
            </option>
          ))}
        </select>
        <label>Orden de Envío</label>
        <select
          value={idordenenvio}
          onChange={(e) => setIdordenenvio(e.target.value)}
        >
          <option value="">Seleccionar Orden de Envío</option>
          {ordenes.map((item) => (
            <option key={item.idordenenvio} value={item.idordenenvio}>
              {item.idordenenvio}
            </option>
          ))}
        </select>
        <button onClick={handleSave}>Guardar</button>
        <button className="close-button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default ModalEdicionRepEntrega;
