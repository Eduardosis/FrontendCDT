import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const AdminVerPaqueterias = () => {
  const [paqueterias, setPaqueterias] = useState([]);
  const [filteredPaqueterias, setFilteredPaqueterias] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [almacenId, setAlmacenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlmacen = async () => {
      try {
        const userId = localStorage.getItem('id');
        const almacenResponse = await axios.get('http://127.0.0.1:8000/api/agr-almacen/');
        const almacenData = almacenResponse.data.find(a => a.usuario === parseInt(userId));
        if (almacenData) {
          setAlmacenId(almacenData.idalmacen);
        } else {
          console.error('No se encontró el almacen para el usuario.');
        }
      } catch (error) {
        console.error('Error fetching almacen:', error);
      }
    };

    fetchAlmacen();
  }, []);

  useEffect(() => {
    const fetchPaqueterias = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/ee-serviciopaqueteria/');
        setPaqueterias(response.data);
      } catch (error) {
        console.error('Error fetching paqueterias:', error);
      }
    };

    fetchPaqueterias();
  }, []);

  useEffect(() => {
    const fetchFilteredPaqueterias = async () => {
      if (!almacenId) return;

      try {
        const almacenPaqueteriaResponse = await axios.get('http://127.0.0.1:8000/api/ee-almacen-paqueteria/');
        const filteredRelations = almacenPaqueteriaResponse.data.filter(ap => ap.almacen === almacenId);
        const paqueteriaIds = filteredRelations.map(ap => ap.paqueteria);

        const filtered = paqueterias.filter(paqueteria => paqueteriaIds.includes(paqueteria.idpaqueteria));
        setFilteredPaqueterias(filtered);
      } catch (error) {
        console.error('Error fetching filtered paqueterias:', error);
      }
    };

    fetchFilteredPaqueterias();
  }, [paqueterias, almacenId]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  const sortedPaqueterias = React.useMemo(() => {
    return [...filteredPaqueterias].sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [filteredPaqueterias, sortConfig]);

  return (
    <div>
      <NavBarAdmin />
      <div>
        <button className='btn btn-success' onClick={goToAdminDashb}>Regresar</button>
      </div>
      <div className="inventory-container">
        <div className="content-wrapper">
          <div className="table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('nombre')} className={sortConfig.key === 'nombre' ? 'sortable active' : 'sortable'}>Nombre</th>
                  <th onClick={() => handleSort('direccion')} className={sortConfig.key === 'direccion' ? 'sortable active' : 'sortable'}>Dirección</th>
                  <th onClick={() => handleSort('telefono')} className={sortConfig.key === 'telefono' ? 'sortable active' : 'sortable'}>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {sortedPaqueterias.length > 0 ? (
                  sortedPaqueterias.map(paqueteria => (
                    <tr key={paqueteria.idpaqueteria}>
                      <td>{paqueteria.nombre}</td>
                      <td>{paqueteria.direccion}</td>
                      <td>{paqueteria.telefono}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No se encontraron paqueterías.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminVerPaqueterias;
