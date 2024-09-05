// Dashboard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkProviderStatus } from '../Apis/apiProviders';  // Asegúrate de tener esta función en tu archivo api.

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyProviderStatus = async () => {
            try {
                const response = await checkProviderStatus();
                if (response.is_provider) {
                    navigate('/provider-dashboard');
                } else {
                    navigate('/provider-register');
                }
            } catch (error) {
                console.error('Error checking provider status:', error);
                navigate('/login');  // Redirigir al login si hay un error
            }
        };

        verifyProviderStatus();
    }, [navigate]);

    return (
        <div>
            <h1>Checking Provider Status...</h1>
        </div>
    );
};

export default Dashboard;
