import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../Css/adminproveedor.module.css'; // Importa el CSS modular
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminVerProveedores = () => {
  const [providers, setProviders] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [almacenId, setAlmacenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlmacen = async () => {
      try {
        const userId = localStorage.getItem('id');
        const almacenResponse = await axios.get('http://127.0.0.1:8000/api/agr-almacen/');
        const almacen = almacenResponse.data.find(a => a.usuario === parseInt(userId));
        if (almacen) {
          setAlmacenId(almacen.idalmacen);
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
    const fetchProviders = async () => {
      try {
        const providerResponse = await axios.get('http://127.0.0.1:8000/api/p-proveedor/?format=json');
        setProviders(providerResponse.data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    if (!almacenId) return;

    const fetchFilteredProviders = async () => {
      try {
        const almacenProveedorResponse = await axios.get('http://127.0.0.1:8000/api/agr-almacen-proveedor/');
        const filteredRelations = almacenProveedorResponse.data.filter(ap => ap.almacen === almacenId);
        const providerIds = filteredRelations.map(ap => ap.proveedor);

        const filteredProviders = providers.filter(provider => providerIds.includes(provider.idproveedor));

        setSearchResults(filteredProviders);
      } catch (error) {
        console.error('Error fetching filtered providers:', error);
      }
    };

    fetchFilteredProviders();
  }, [providers, almacenId]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  useEffect(() => {
    const sortedProviders = [...searchResults]
      .sort((a, b) => {
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

    setSearchResults(sortedProviders);
  }, [sortConfig, searchResults]);

  useEffect(() => {
    const searchFilteredProviders = providers.filter(provider =>
      provider.nombrepila.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.apellidopat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.apellidomat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.empresa.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(searchFilteredProviders);
  }, [searchTerm, providers]);

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <NavBarAdmin />
      <FaArrowLeft className={styles.backArrow4} size={30} onClick={goToAdminDashb} />
      <div>
      </div>
      <div className={styles.inventoryContainer}>
        <div className={styles.searchAndFilter}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Buscar proveedores..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.tableContainer}>
            <table className={styles.productTable}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('nombrepila')} className={`${styles.sortable} ${sortConfig.key === 'nombrepila' ? styles.active : ''}`}>Nombre</th>
                  <th onClick={() => handleSort('apellidopat')} className={`${styles.sortable} ${sortConfig.key === 'apellidopat' ? styles.active : ''}`}>Apellido Paterno</th>
                  <th onClick={() => handleSort('apellidomat')} className={`${styles.sortable} ${sortConfig.key === 'apellidomat' ? styles.active : ''}`}>Apellido Materno</th>
                  <th onClick={() => handleSort('telefono')} className={`${styles.sortable} ${sortConfig.key === 'telefono' ? styles.active : ''}`}>Teléfono</th>
                  <th onClick={() => handleSort('empresa')} className={`${styles.sortable} ${sortConfig.key === 'empresa' ? styles.active : ''}`}>Empresa</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length > 0 ? (
                  searchResults.map(provider => (
                    <tr key={provider.idproveedor}>
                      <td>{provider.nombrepila}</td>
                      <td>{provider.apellidopat}</td>
                      <td>{provider.apellidomat}</td>
                      <td>{provider.telefono}</td>
                      <td>{provider.empresa}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No se encontraron proveedores.</td>
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

export default AdminVerProveedores;
