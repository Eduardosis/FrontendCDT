import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Css/clientes.css'; 
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const idProveedorLogueado = localStorage.getItem('provider_id'); // Obtener el ID del proveedor desde el almacenamiento local

    if (idProveedorLogueado) {
      axios.get('http://localhost:8000/api/p-clientesp/')
        .then(response => {
          const clientesFiltrados = response.data.filter(cliente => cliente.proveedor === parseInt(idProveedorLogueado));
          setClientes(clientesFiltrados);
        })
        .catch(error => {
          console.error('Error al obtener los clientes:', error);
          setError('Error al obtener los clientes. Inténtelo de nuevo más tarde.');
        });
    } else {
      setError('No se encontró el ID del proveedor. Inicie sesión nuevamente.');
    }
  }, []);

  const imagenes = [
    "https://empaquestermoformados.com.mx/assets/img/contacto20.png"
  ];

  return (
    <div>
      <NavBarNoMenu />
      <h1>Lista de clientes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="paqueteria-table">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Calle</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(clientes) && clientes.map((cliente, index) => (
            <tr key={cliente.idclientep}>
              <td>
                <img
                  src={imagenes[index % imagenes.length]}
                  alt={cliente.nombrepila}
                  className="card-img-top"
                />
              </td>
              <td>{cliente.nombrepila}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.calle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaClientes;
