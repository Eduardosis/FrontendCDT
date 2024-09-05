import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Css/AdminProfile.css';
import NavBarAdmin from '../../NavBar/NavBarAdmin';
import Footer from '../../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminProfile = () => {
  const [userEmail, setUserEmail] = useState('');
  const [almacen, setAlmacen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const userId = localStorage.getItem('id');
        console.log('User ID from localStorage:', userId);
        if (!userId) {
          throw new Error('No user ID found');
        }

        const parsedUserId = parseInt(userId, 10);
        console.log('Parsed User ID:', parsedUserId);

        const token = localStorage.getItem('access_token');
        console.log('Access Token from localStorage:', token);
        if (!token) {
          throw new Error('No auth token found');
        }

        // Fetch users
        const response = await axios.get('http://127.0.0.1:8000/api/agr-usuario/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('API response data:', response.data);

        // Parse the response data to ensure it's an array
        const users = Array.isArray(response.data) ? response.data : [];
        console.log('Parsed users array:', users);

        // Find the logged-in user
        const loggedInUser = users.find(user => user.idusuario === parsedUserId);
        console.log('Logged-in user:', loggedInUser);

        if (loggedInUser) {
          setUserEmail(loggedInUser.correo);

          // Fetch warehouse info for the logged-in user
          const almacenResponse = await axios.get('http://127.0.0.1:8000/api/agr-almacen/');
          const almacenData = almacenResponse.data.find(a => a.usuario === parsedUserId);
          setAlmacen(almacenData || {});
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleChangePassword = () => {
    // Placeholder for change password functionality
    navigate('/admin-change-password');
  };

  const goToAdminDashb = () => {
    navigate('/admin');
  };

  return (
      <div>
        <NavBarAdmin />
        <FaArrowLeft className="back-arrow3" size={30} onClick={goToAdminDashb} />
        <div className="profile-container">
          <div className="profile-info">
            <h2>Perfil del Usuario Administrador</h2>
            <p><strong>Correo Electrónico:</strong> {userEmail}</p>
            {almacen && (
              <>
                <h3>Información del Almacén</h3>
                <p><strong>Nombre del Almacén:</strong> {almacen.nombre || 'No disponible'}</p>
                <p><strong>Dirección:</strong> {almacen.direccion || 'No disponible'}</p>
                <p><strong>Teléfono:</strong> {almacen.telefono || 'No disponible'}</p>
              </>
            )}
            <button className='btn btn-primary' onClick={handleChangePassword}>Cambiar Contraseña</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  
};

export default AdminProfile;