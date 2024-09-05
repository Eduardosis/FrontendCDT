import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBarNoMenu from '../NavBar/NavBarNoMenu';



const ProductosList = () => {

  const [productos, SetProductos] = useState([]);
  const [id, SetId] = useState('');

  console.log('id',id)

  const token = localStorage.getItem('access_token');
  const providerId = localStorage.getItem('provider_id'); 
  console.log(productos)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
    
        const response = await axios.get('http://127.0.0.1:8000/api/get-provider-products/', {
          //headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          //},
          params: {
            'provider_id': providerId,
          },
          withCredentials: true,
        });
        SetProductos(response.data.products)
      } catch (error) {
        console.error('Error in API call:', error.response ? error.response.data : error.message);
        throw error;
      }
     
    };

    fetchProductos();
  }, [token]);


 

  return (
    <div>
        <NavBarNoMenu />
      <h1>Lista de Productos</h1>
      <div>
      <style>
        {`
          .product-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: flex-start;
          }

          .card {
            width: 18rem;
            border: 1px solid #ccc;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .card-body {
            padding: 16px;
            background-color: black;
            color: white;
          }

          .card-title {
            margin-bottom: 8px;
          }

          .card-text {
            margin-bottom: 12px;
          }

          .button-container {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .btn-primary {
            background-color: purple;
            border: none;
            color: white;
            padding: 8px 16px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin-top: 8px;
            cursor: pointer;
            border-radius: 4px;
          }

          .card-img-top {
            flex: 1;
           height:170px;
            }

        `}
      </style>
      <div className="product-grid">
        {productos.map((producto) => (
          <div key={producto.idproducto} className="card">
             {producto.images && producto.images.length > 0 ? (
                            <img
                                src={producto.images[0]}
                                alt={producto.nombre}
                                className="card-img-top"
                            />
                        ) : (
                            <img
                                src="https://via.placeholder.com/150" // Imagen de reserva si no hay fotos
                                alt="Imagen no disponible"
                                className="card-img-top"
                            />
                        )}
            <div className="card-body">
              <h5 className="card-title">{producto.name}</h5>
              <p className="card-text">Stock: {producto.stock}</p>
              <p className="card-text">Almacén: {producto.almacen}</p>
              <div className="button-container">
              <button className="btn btn-primary">
               Ver Producto
              </button>
              </div>
            </div>
          </div>
        ))}
  </div>
  </div>
     
  </div>
  

  );

 
};

export default ProductosList;