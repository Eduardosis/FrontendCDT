import axios from 'axios';

// Crear una instancia de axios con una URL base
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // URL base de tu backend Django
});

// Función para realizar el login
export const login = async (email, password) => {
    try {
        // Realizar una solicitud POST al endpoint de login
        const response = await api.post('/user/login/', { email, password });
        // Almacenar el token de acceso en el localStorage del navegador
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user_role', response.data.role); // Almacenar el rol del usuario
        localStorage.setItem('id', response.data.id);
        
        // Devolver los datos de la respuesta
        return response.data;
    } catch (error) {
        // Lanzar un error si la solicitud falla
        throw error;
    }
};

export const register = async (email, password, rolUsuario) => {
    try {
        const response = await api.post('/user/register/', { email, password, rolUsuario });
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user_role', response.data.role); // Almacenar el rol del usuario
        localStorage.setItem('id', response.data.id);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Función para realizar el logout
export const logout = () => {
    // Eliminar el token de acceso del localStorage del navegador
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role'); // Eliminar el rol del usuario al cerrar sesión
    localStorage.removeItem('id'); //EliminarID
    localStorage.removeItem('provider_id'); 
};
