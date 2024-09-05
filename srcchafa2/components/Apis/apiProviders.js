// src/components/Apis/apiProvider.js
import axios from 'axios';

const getToken = () => {
    return localStorage.getItem('access_token'); // Asegúrate de almacenar el token aquí después del login
  };

  export const getEmpresas = async () => {
    const token = getToken();
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/p-empresa/', {
        //headers: {
          //Authorization: `Bearer ${token}` // Agregar el token JWT al encabezado de autorización
       // }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching empresas:', error);
      throw error;
    }
  };

  export const createProvider = async (providerData) => {
    const token = getToken();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/p-proveedor/', providerData, {
        //headers: {
        //  Authorization: `Bearer ${token}` // Agregar el token JWT al encabezado de autorización
      // }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating provider:', error);
      throw error;
    }
  };
  
  export const checkProviderStatus = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/check-provider-status/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error in API call:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  
  export const getAdminId = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Error('No token found');
    }
    try{
    const response = await axios.get('http://127.0.0.1:8000/api/agr-usuario/', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        withCredentials: true
    });
    return response.data;
    } catch (error){
    console.error('Error in API call:', error.response ? error.response.data : error.message);
    throw error;
      }
  };

//api para obtener un id del proveedor 
export const getProviderId = async () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
      throw new Error('No token found');
  }
  try{
  const response = await axios.get('http://127.0.0.1:8000/api/get-provider-id/', {
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',  
      },
      withCredentials: true
  });
  return response.data;
  } catch (error){
  console.error('Error in API call:', error.response ? error.response.data : error.message);
  throw error;
    }
};

export const createClient = async (clientData) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
      throw new Error('No token found');
  }

  const response = await axios.post('http://127.0.0.1:8000/api/p-clientesp/', clientData, {
     // headers: {
       //   'Authorization': `Bearer ${token}`
      //}
  });

  return response.data;
};

///apis que se utilizan en providers, pero que tambien comienzas a ser parte de la aplicacion de almacenreporteproductos

export const getProviderProducts = async () => {
  const token = localStorage.getItem('access_token');  // Obtener el token del localStorage
  const providerId = localStorage.getItem('provider_id');  // Obtener el provider_id del localStorage
  if (!token) {
    throw new Error('No token found');
  }
  if (!providerId) {
    throw new Error('No provider ID found');
  }

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
    return response.data.products;
  } catch (error) {
    console.error('Error in API call:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getProviderClients = async () => {
  const token = localStorage.getItem('access_token');  // Obtener el token del localStorage
  if (!token) {
      throw new Error('No token found');
  }

  try{
    const response = await axios.get('http://127.0.0.1:8000/api/get-provider-clients/', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',  
        },
        withCredentials: true
    });
    return response.data;
    } catch (error){
    console.error('Error in API call:', error.response ? error.response.data : error.message);
    throw error;
      }
};

export const createOrder = async (orderData) => {
  const token = localStorage.getItem('access_token');  // Obtener el token del localStorage
  if (!token) {
      throw new Error('No token found');
  }

  const response = await axios.post('http://127.0.0.1:8000/api/create-order/', orderData, {
     /// headers: {
        //  'Authorization': `Bearer ${token}`,  // Incluir el token en los encabezados
         // 'Content-Type': 'application/json'
      //}
  });

  return response.data;
};

export const getProviderOrders = async () => {
  const token = localStorage.getItem('access_token');  // Obtener el token del localStorage
  const providerId = localStorage.getItem('provider_id');  // Obtener el provider_id del localStorage
  if (!token) {
    throw new Error('No token found');
  }
  if (!providerId) {
    throw new Error('No provider ID found');
  }

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/get-provider-orders/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        'provider_id': providerId,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error in API call:', error.response ? error.response.data : error.message);
    throw error;
  }
};