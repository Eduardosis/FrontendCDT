import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Css/adminproductosavp.css';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminVerProductos = () => {
  const [products, setProducts] = useState([]);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlmacen, setSelectedAlmacen] = useState('');
  const [almacenes, setAlmacenes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
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

  // Logica de paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const loadImage = (product) => {
    const image = product.photos.length > 0 ? product.photos[0].link : 'default.png';
    try {
      return require(`../../../assets/img/${image}`);
    } catch {
      return require('../../../assets/img/cdtlogo.png');
    }
  };

  return (
    <div>
      <NavBarAdmin />
      <FaArrowLeft className="back-arrow-avp" size={30} onClick={goToAdminDashb} />
      <div className="inventory-container-avp">
        <div className="search-and-filter-avp">
          <div className="search-bar-avp">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input-avp"
            />
          </div>
          <div className="almacen-selector-avp">
            <select value={selectedAlmacen} onChange={handleAlmacenChange}>
              <option value="">Todos los almacenes</option>
              {almacenes.map(almacen => (
                <option key={almacen} value={almacen}>{almacen}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="content-wrapper-avp">
          <div className="photo-preview-avp">
            {hoveredProduct ? (
              <img 
                src={loadImage(hoveredProduct)} 
                alt={hoveredProduct.nombre} 
                className="hovered-product-image-avp" 
              />
            ) : (
              <div className="no-image-avp">No image available</div>
            )}
          </div>
          <div className="table-container-avp">
            <table className="product-table-avp">
              <thead>
                <tr>
                  <th onClick={() => handleSort('nombre')} className={sortConfig.key === 'nombre' ? 'sortable-avp active-avp' : 'sortable-avp'}>Nombre</th>
                  <th onClick={() => handleSort('stock')} className={sortConfig.key === 'stock' ? 'sortable-avp active-avp' : 'sortable-avp'}>Cantidad</th>
                  <th onClick={() => handleSort('detail.precio')} className={sortConfig.key === 'detail.precio' ? 'sortable-avp active-avp' : 'sortable-avp'}>Precio</th>
                  <th onClick={() => handleSort('detail.tamaño')} className={sortConfig.key === 'detail.tamaño' ? 'sortable-avp active-avp' : 'sortable-avp'}>Tamaño</th>
                  <th onClick={() => handleSort('detail.marca')} className={sortConfig.key === 'detail.marca' ? 'sortable-avp active-avp' : 'sortable-avp'}>Marca</th>
                  <th onClick={() => handleSort('almacen')} className={sortConfig.key === 'almacen' ? 'sortable-avp active-avp' : 'sortable-avp'}>Almacén</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map(product => (
                  <tr
                    key={product.idproducto}
                    onMouseEnter={() => setHoveredProduct(product)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <td>{product.nombre}</td>
                    <td className={product.stock > 0 ? 'in-stock-avp' : 'out-of-stock-avp'}>{product.stock}</td>
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
        <div className="pagination-avp">
          {Array.from({ length: Math.ceil(filteredAndSortedProducts.length / productsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={currentPage === index + 1 ? 'active-avp' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminVerProductos;
