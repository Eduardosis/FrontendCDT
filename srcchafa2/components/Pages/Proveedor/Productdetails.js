import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [details, setDetails] = useState([]);
  const [photos, setPhotos] = useState([]);
  const { productId } = useParams();
  console.log(photos)

  useEffect(() => {
    if (productId) {
      axios.get(`http://127.0.0.1:8000/api/agr-productos/${productId}/`)
        .then(response => {
          setProduct(response.data);
  
          return Promise.all([
            axios.get('http://127.0.0.1:8000/api/agr-detalleproductos/'),
            axios.get('http://127.0.0.1:8000/api/agr-fotos/')
          ]);
        })
        .then(([detailsResponse, photosResponse]) => {
          const productDetails = detailsResponse.data.filter(detail => detail.producto === productId);
          const productPhotos = photosResponse.data.filter(photo => photo.producto === productId);
  
          setDetails(productDetails);
          setPhotos(productPhotos);
        })
        .catch(error => {
          console.error("Error fetching product details:", error);
        });
    }
  }, [productId]);
  
  if (!product) return <p>Loading...</p>;

  // Estilos en línea
  const styles = {
    detalleProductoContainer: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      marginTop: '20px'
    },
    productoInfoContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '20px',
      marginLeft: '20px'
    },
    cardImgTop: {
      flex: 1,
      marginRight: '20px'
    },
    productoFoto: {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px'
    },
    productoInfo: {
      flex: 2
    },
    productoInfoParagraph: {
      margin: '10px 0',
      marginLeft: '20px'
    },
    productoInfoHeading: {
      marginBottom: '10px',
      marginLeft: '20px'
    },
    productoDetalles: {
      marginTop: '20px'
    },
    detalleItem: {
      borderTop: '1px solid #ccc',
      paddingTop: '10px',
      marginTop: '10px'
    },
    detalleItemParagraph: {
      margin: '5px 0'
    },
    strong: {
      fontWeight: 'bold'
    }
  };


  return (
    <div style={styles.detalleProductoContainer}>
    <Link to="/productos">Back to Product List</Link>
    <div style={styles.productoInfoContainer}>
      <div style={styles.cardImgTop}>
        {photos.length > 0 ? (
          photos.map(photo => (
            <img key={photo.idfoto} src={photo.link} alt={product.nombre} style={styles.productoFoto} />
          ))
        ) : (
          <p>No hay fotos disponibles para este producto.</p>
        )}
      </div>
      <div style={styles.productoInfo}>
        <h2 style={styles.productoInfoHeading}>{product.nombre}</h2>
        <p style={styles.productoInfoParagraph}><strong style={styles.strong}>Stock:</strong> {product.stock}</p>
        <p style={styles.productoInfoParagraph}><strong style={styles.strong}>Almacen:</strong> {product.almacen}</p>
        <div style={styles.productoDetalles}>
          <h3>Detalles:</h3>
          {details.map(detail => (
            <div key={detail.iddetalleproducto} style={styles.detalleItem}>
              <p style={styles.detalleItemParagraph}><strong style={styles.strong}>Modelo:</strong> {detail.modelo}</p>
              <p style={styles.detalleItemParagraph}><strong style={styles.strong}>Marca:</strong> {detail.marca}</p>
              <p style={styles.detalleItemParagraph}><strong style={styles.strong}>Peso:</strong> {detail.peso}</p>
              <p style={styles.detalleItemParagraph}><strong style={styles.strong}>Tamaño:</strong> {detail.tamaño}</p>
              <p style={styles.detalleItemParagraph}><strong style={styles.strong}>Estado:</strong> {detail.estado}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProductDetails;