import React, {useState, useEffect} from 'react';
import axios from 'axios';
import '../Css/adminproductos.css';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';

const AdminVerProductos = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlmacen, setSelectedAlmacen] = useState('');
  const [almacenes, setAlmacenes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsResponse, detailsResponse, photosResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/agr-productos/?format=json'),
          axios.get('http://127.0.0.1:8000/api/agr-detalleproductos/?format=json'),
          axios.get('http://127.0.0.1:8000/api/agr-fotos/?format=json')
        ]);

        const combinedData = productsResponse.data.map(product => ({
          ...product,
          detail: detailsResponse.data.find(detail => detail.producto === product.idproducto),
          photos: photosResponse.data.filter(photo => photo.producto === product.idproducto)
        }));

        setProducts(combinedData);

        // Extraer almacenes únicos
        const uniqueAlmacenes = [...new Set(combinedData.map(product => product.almacen))];
        setAlmacenes(uniqueAlmacenes);
        
        // Establecer el primer almacén como seleccionado por defecto
        if (uniqueAlmacenes.length > 0) {
          setSelectedAlmacen(uniqueAlmacenes[0]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAlmacenChange = (event) => {
    setSelectedAlmacen(event.target.value);
  };

  const filteredAndSortedProducts = React.useMemo(() => {
    return [...products]
      .filter(product => 
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAlmacen === '' || product.almacen === selectedAlmacen)
      )
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
        const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      });
  }, [products, sortConfig, searchTerm, selectedAlmacen]);

  return (
    <div>
      <NavBarNoMenu />
      <div>
        <button className='btn btn-success' onClick={goToAdminDashb}>Regresar</button>
      </div>
    <div className="inventory-container">
      <div className="search-and-filter">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="search-button">
            <span role="img" aria-label="search">🔍</span>
          </button>
        </div>
        <div className="almacen-selector">
          <select value={selectedAlmacen} onChange={handleAlmacenChange}>
            <option value="">Todos los almacenes</option>
            {almacenes.map(almacen => (
              <option key={almacen} value={almacen}>{almacen}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="photo-preview">
          {hoveredProduct && hoveredProduct.photos.length > 0 ? (
            <img src={hoveredProduct.photos[0].link} alt={hoveredProduct.nombre} />
          ) : (
            <div className="no-image">No image available</div>
          )}
        </div>
        <div className="table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('nombre')} className={sortConfig.key === 'nombre' ? 'sortable active' : 'sortable'}>Nombre</th>
                <th onClick={() => handleSort('stock')} className={sortConfig.key === 'stock' ? 'sortable active' : 'sortable'}>Cantidad</th>
                <th onClick={() => handleSort('detail.precio')} className={sortConfig.key === 'detail.precio' ? 'sortable active' : 'sortable'}>Precio</th>
                <th onClick={() => handleSort('detail.tamaño')} className={sortConfig.key === 'detail.tamaño' ? 'sortable active' : 'sortable'}>Tamaño</th>
                <th onClick={() => handleSort('detail.marca')} className={sortConfig.key === 'detail.marca' ? 'sortable active' : 'sortable'}>Marca</th>
                <th onClick={() => handleSort('almacen')} className={sortConfig.key === 'almacen' ? 'sortable active' : 'sortable'}>Almacén</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProducts.map(product => (
                <tr
                  key={product.idproducto}
                  onMouseEnter={() => setHoveredProduct(product)}
                  onMouseLeave={() => setHoveredProduct(product)}
                >
                  <td>{product.nombre}</td>
                  <td className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>{product.stock}</td>
                  <td>{product.detail?.precio ?? 'N/A'}</td>
                  <td>{product.detail?.tamaño ?? 'N/A'}</td>
                  <td>{product.detail?.marca ?? 'N/A'}</td>
                  <td>{product.almacen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};


export default AdminVerProductos;
