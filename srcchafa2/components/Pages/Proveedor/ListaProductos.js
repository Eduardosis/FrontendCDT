import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const providerId = localStorage.getItem('provider_id') || '';

  useEffect(() => {
    if (providerId) {
      // Fetch categories
      axios.get('http://127.0.0.1:8000/api/agr-categoriaproducto/')
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => {
          console.error("Error fetching categories:", error);
        });

      // Fetch all photos
      axios.get('http://127.0.0.1:8000/api/agr-fotos/')
        .then(response => {
          setPhotos(response.data);
        })
        .catch(error => {
          console.error("Error fetching photos:", error);
        });

      // Initially fetch all products for the provider
      fetchProviderProducts();
    }
  }, [providerId]);

  const fetchProviderProducts = () => {
    axios.get('http://127.0.0.1:8000/api/agr-producto-proveedor/')
      .then(response => {
        const productIds = response.data
          .filter(record => record.proveedor === parseInt(providerId))
          .map(record => record.producto);

        return Promise.all(productIds.map(id =>
          axios.get(`http://127.0.0.1:8000/api/agr-productos/${id}/`)
            .catch(error => {
              console.error(`Error fetching product with ID ${id}:`, error);
              return null;
            })
        ));
      })
      .then(results => {
        const fullProducts = results
          .filter(result => result !== null)
          .map(result => result.data);

        setProducts(fullProducts);
      })
      .catch(error => {
        console.error("Error fetching provider's products:", error);
      });
  };

  const fetchProductsByCategory = (categoryId) => {
    axios.get(`http://127.0.0.1:8000/api/agr-categoria-producto/`)
      .then(response => {
        const categoryProducts = response.data
          .filter(record => record.categorias === categoryId)
          .map(record => record.productos);

        return Promise.all(categoryProducts.map(id =>
          axios.get(`http://127.0.0.1:8000/api/agr-productos/${id}/`)
            .catch(error => {
              console.error(`Error fetching product with ID ${id}:`, error);
              return null;
            })
        ));
      })
      .then(results => {
        const fullProducts = results
          .filter(result => result !== null)
          .map(result => result.data);

        setProducts(fullProducts);
      })
      .catch(error => {
        console.error("Error fetching products by category:", error);
      });
  };

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value === "" ? null : parseInt(event.target.value);
    setSelectedCategory(selectedCategoryId);

    if (selectedCategoryId) {
      fetchProductsByCategory(selectedCategoryId);
    } else {
      // Fetch all products if no category is selected
      fetchProviderProducts();
    }
  };

  // Function to get product photos
  const getProductPhotos = (productId) => {
    return photos
      .filter(photo => photo.producto === productId)
      .map(photo => photo.link);
  };

// Estilos en línea
  const styles = {
   
    filterContainer: {
      marginBottom: '20px', 
      marginTop: '20px',   
      display: 'flex',
      alignItems: 'center',
      marginLeft: '40px', 
    },
    label: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginRight: '10px',
    },
    select: {
      fontSize: '16px',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#fff',
      cursor: 'pointer',
    },
  

    productGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'flex-start'
    },
    card: {
      width: '18rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    },
    cardImgTop: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    cardBody: {
      padding: '16px',
      backgroundColor: 'black',
      color: 'white'
    },
    cardTitle: {
      marginBottom: '8px'
    },
    cardText: {
      marginBottom: '12px'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnPrimary: {
      backgroundColor: 'purple',
      border: 'none',
      color: 'white',
      padding: '8px 16px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px',
      marginTop: '8px',
      cursor: 'pointer',
      borderRadius: '4px'
    }
  };



  return (
    <div>
        <NavBarNoMenu />
      <div>
      <div style={styles.filterContainer}>
        <label htmlFor="category"></label>
        <select id="category" onChange={handleCategoryChange} value={selectedCategory || ''}>
          <option value="">Todas las Categorías</option>
          {categories.map(category => (
            <option key={category.idcategoriaprod} value={category.idcategoriaprod}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>
      </div>


      {products.length === 0 ? (
        <p>No hay productos asociados.</p>
      ) : (
        <div style={styles.productGrid}>
          {products.map(product => (
            <div key={product.idproducto} style={styles.card}>
              {getProductPhotos(product.idproducto).length > 0 && (
                <img 
                  src={getProductPhotos(product.idproducto)[0]} 
                  alt={product.nombre} 
                  style={styles.cardImgTop} 
                />
              )}
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{product.nombre}</h3>
                <p style={styles.cardText}>Stock: {product.stock}</p>
                <p style={styles.cardText}>Almacen: {product.almacen}</p>
                <div style={styles.buttonContainer}>
                  <Link to={`/productos/${product.idproducto}`} style={styles.btnPrimary}>
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;