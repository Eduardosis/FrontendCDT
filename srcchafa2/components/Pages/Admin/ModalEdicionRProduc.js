import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModalEdicion = ({ reporte, onClose, onSave }) => {
  const [cantidad, setCantidad] = useState(reporte?.cantidad || 0);
  const [detalles, setDetalles] = useState(reporte?.detalles || '');
  const [fecha, setFecha] = useState(reporte?.fecha || '');
  const [producto, setProducto] = useState(reporte?.producto || '');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    setCantidad(reporte?.cantidad || 0);
    setDetalles(reporte?.detalles || '');
    setFecha(reporte?.fecha || '');
    setProducto(reporte?.producto || '');

    // Obtener la lista de productos disponibles
    axios.get('http://127.0.0.1:8000/api/agr-productos/')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener los productos:', error));
  }, [reporte]);

  const handleSave = () => {
    const updatedReporte = {
      ...reporte,
      cantidad,
      detalles,
      fecha,
      producto,
    };

    axios.put(`http://127.0.0.1:8000/api/agr-reporteproducto-falla/${reporte.idpfallas}/`, updatedReporte)
      .then(response => {
        onSave(updatedReporte);
        onClose();
      })
      .catch(error => console.error('Error al actualizar el reporte:', error));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Reporte</h2>
        <label>
          Cantidad:
          <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        </label>
        <label>
          Detalles:
          <input type="text" value={detalles} onChange={(e) => setDetalles(e.target.value)} />
        </label>
        <label>
          Fecha:
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
        <label>
          Producto:
          <select value={producto} onChange={(e) => setProducto(e.target.value)}>
            {productos.map(p => (
              <option key={p.idproducto} value={p.idproducto}>
                {p.idproducto}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSave}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default ModalEdicion;
