import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/clientes.css'; 
import NavBarNoMenu from '../NavBar/NavBarNoMenu';



const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);

  const token = localStorage.getItem('access_token');
  console.log(token)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/get-provider-clients/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',  
            },
            withCredentials: true
        });
        if (response.data && Array.isArray(response.data.clients)) {
            setClientes(response.data.clients);
          } 
        console.log(response.data)
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, [token]);

  const imagenes = [
    "https://empaquestermoformados.com.mx/assets/img/contacto20.png"
  
  ];
  
  

  return (
    <div>
    <NavBarNoMenu />
    <h1>Lista de clientes</h1>
    <table className="paqueteria-table">
      <thead>
        <tr>
         <th></th>
          <th>Nombre</th>
          <th>Telefono</th>
          <th>Calle</th>
        </tr>
      </thead>
      <tbody>
      {Array.isArray(clientes) && clientes.map((cliente, index) => (
            <tr key={cliente.id}>
              <td>
                <img
                  src={imagenes[index % imagenes.length]}
                  alt={cliente.nombrepila}
                  className="card-img-top"
                />
              </td>
              <td>{cliente.name}</td>
              <td>{cliente.Telefono}</td>
              <td>{cliente.Calle}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
    
 
  );
};

export default ListaClientes;
