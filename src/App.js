import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Pages/Login';
import Register from './components/Pages/Register';
import Admin from './components/Pages/Admin';
import Provider from './components/Pages/Provider';
import Dashboard from './components/Pages/Dashboard';
import ProviderDashboard from './components/Pages/Proveedor/ProviderDashboard'; 
import ProviderRegClients from './components/Pages/Proveedor/ProviderRegClients'; 
import ProviderOrderCreate from './components/Pages/Proveedor/ProviderOrderCreate';
import ProviderOrderShow from './components/Pages/Proveedor/ProviderOrderShow';
import ListaClientes from './components/Pages/Proveedor/Listclientes';
import ProductosList from './components/Pages/Proveedor/ListaProductos';
import ProviderRepShip from './components/Pages/Proveedor/ProviderRepShipments';
import ProviderRepDeli from './components/Pages/Proveedor/ProviderRepDelivery';
import ProviderProdRequest from './components/Pages/Proveedor/ProviderProdRequest';
import ProviderClients from './components/Pages/Proveedor/ProviderClients';
import ProviderWarehouses from './components/Pages/Proveedor/ProviderWarehouses';
import ProductDetails from './components/Pages/Proveedor/Productdetails';
import AdminReporteProFalla from './components/Pages/Admin/AdminReporteProFalla';
import AdminDashboard from './components/Pages/Admin';
import AdminVerProductos from './components/Pages/Admin/AdminVerProductos';
import AdminReporteProRecibido from './components/Pages/Admin/AdminReporteProRecibido';
import SolicitarProducto from './components/Pages/Admin/AdminSolicitarProducto';
import AgrProductoForm from './components/Pages/Admin/AdminProductos';
import ProviderChangePassword from './components/Pages/Proveedor/ProviderChangePass';
import ProviderProfile from './components/Pages/Proveedor/ProviderProfile';
import AdminVerProveedores from './components/Pages/Admin/AdminProveedor';
import AdminVerPaqueterias from './components/Pages/Admin/AdminPaqueteria';
import AdminProfile from './components/Pages/Admin/AdminPerfil';
import AdminVerRepEntrega from './components/Pages/Admin/AdminVerRepEntrega';
import AdminVerRepoFalla from './components/Pages/Admin/AdminVerRepFalla';
import AdminReporteRecoleccion from './components/Pages/Admin/AdminReporteRecoleccion';
import AdminVerRepRecoleccion from './components/Pages/Admin/AdminVerRepRecoleccion';
import AdminverRepEnvio from './components/Pages/Admin/AdminverRepEnvio';
import AdminVerRepRecibidos from'./components/Pages/Admin/AdminVerRepRecibidos';
import ReporteEnvios from './components/Pages/Admin/envioreporte';
import ReporteEntregas from './components/Pages/Admin/ReporteEntrega';
import AdminChangePassword from './components/Pages/Admin/AdminChangePass';
import AdminAgregarRepartidor from './components/Pages/Admin/AdminAgregarRepartidor';
import AdminAgregarCamion from './components/Pages/Admin/AdminAgregarCamion';
import AdminVerRepartidor from './components/Pages/Admin/AdminVerRepartidores';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('id');
        setIsAuthenticated(false);
    };

    const handleRegister = (role) => {
        setIsAuthenticated(true);
        if (role === '1') {
            window.location.href = '/register';
        } else if (role === '2') {
            window.location.href = '/provider';
        }
    };

    const userRole = localStorage.getItem('user_role');

    return (
        <Router>
            <Routes>
                <Route path="/clientes" element={userRole === '2' ? <ListaClientes /> : <Navigate to="/" />} />
                <Route path="/productos" element={userRole === '2' ? <ProductosList /> : <Navigate to="/" />} />
                <Route path="/productos/:productId" element={<ProductDetails />} /> 
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                <Route path="/register" element={userRole === '1' ? <Navigate to="/" /> : <Register />} />                
                <Route path="/provider-dashboard" element={userRole === '2' ? <ProviderDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/provider-reg-clients" element={userRole === '2' ? <ProviderRegClients /> : <Navigate to="/" />} />                
                <Route path="/provider-create-order" element={userRole === '2' ? <ProviderOrderCreate /> : <Navigate to="/" />} />
                <Route path="/provider-show-order" element={userRole === '2' ? <ProviderOrderShow /> : <Navigate to="/" />} /> 
                <Route path="/provider-view-clients" element={userRole === '2' ? <ProviderClients /> : <Navigate to="/" />} />
                <Route path="/provider-view-warehouses" element={userRole === '2' ? <ProviderWarehouses /> : <Navigate to="/" />} />
                <Route path="/provider-rep-ship" element={userRole === '2' ? <ProviderRepShip /> : <Navigate to="/" />} />
                <Route path="/provider-rep-deli" element={userRole === '2' ? <ProviderRepDeli /> : <Navigate to="/" />} />
                <Route path="/provider-prod-request" element={userRole === '2' ? <ProviderProdRequest /> : <Navigate to="/" />} />
                <Route path="/provider-change-password" element={userRole === '2' ? <ProviderChangePassword /> : <Navigate to="/" />} />
                <Route path="/provider-profile" element={userRole === '2' ? <ProviderProfile />: <Navigate to="/" />} />
               
                <Route path="/admin" element={userRole === '1' ? <Admin onLogout={handleLogout} /> : <Navigate to="/" />} />
                <Route path="/adminReporteProFalla" element={userRole === '1' ? <AdminReporteProFalla /> : <Navigate to="/" />} />
                <Route path="/adminReporteProRecibido" element={userRole === '1' ? <AdminReporteProRecibido /> : <Navigate to="/" />} />
                <Route path="/adminVerProductos" element={userRole === '1' ? <AdminVerProductos /> : <Navigate to="/" />} />
                <Route path="/adminsolicitarproducto" element={userRole === '1' ? <SolicitarProducto /> : <Navigate to="/" />} />
                <Route path="/adminproductos" element={userRole === '1' ? <AgrProductoForm /> : <Navigate to="/" />} />
                <Route path="/admin-view-providers" element={userRole === '1' ? <AdminVerProveedores /> : <Navigate to="/" />} />
                <Route path="/admin-view-shipping-services" element={userRole === '1' ? <AdminVerPaqueterias /> : <Navigate to="/" />} />
                <Route path="/admin-profile" element={userRole === '1' ? <AdminProfile /> : <Navigate to="/" />} />
                <Route path="/adminrepentrega" element={userRole === '1' ? <AdminVerRepEntrega /> : <Navigate to="/" />} />
                
                <Route path="/adminverrepofalla" element={userRole === '1' ? <AdminVerRepoFalla /> : <Navigate to="/" />} />
                <Route path="/adminreporterecoleccion" element={userRole === '1' ? <AdminReporteRecoleccion /> : <Navigate to="/" />} />
                <Route path="/adminverreprecoleccion" element={userRole === '1' ? <AdminVerRepRecoleccion /> : <Navigate to="/" />} />
                <Route path="/adminverrepenvio" element={userRole === '1' ? <AdminverRepEnvio /> : <Navigate to="/" />} />
                <Route path="/adminverreprecibidos" element={userRole === '1' ? <AdminVerRepRecibidos /> : <Navigate to="/" />} />
                <Route path="/admin-change-password" element={userRole === '1' ? <AdminChangePassword /> : <Navigate to="/" />} />
                <Route path="/adminagregarrepartidor" element={userRole === '1' ? <AdminAgregarRepartidor /> : <Navigate to="/" />} />
                <Route path="/adminagregarcamion" element={userRole === '1' ? <AdminAgregarCamion /> : <Navigate to="/" />} />
                <Route path="/adminverrepartidor" element={userRole === '1' ? <AdminVerRepartidor /> : <Navigate to="/" />} />
                
                <Route path="/entrega" element={userRole === '1' ? <ReporteEntregas /> : <Navigate to="/" />} />
                <Route path="/envio" element={userRole === '1' ? <ReporteEnvios /> : <Navigate to="/" />} />
                <Route path="/" element={
                    isAuthenticated ? (
                        userRole === '1' ? <Navigate to="/admin" /> :
                        userRole === '2' ? <Dashboard /> :
                        <div>Unknown role</div>
                         // Redirigir al Dashboard para verificar el estado del proveedor
                    ) : <Navigate to="/login" />
                } />
                <Route path="/provider-dashboard" element={<ProviderDashboard />} />
                <Route path="/provider-register" element={userRole === '2' ? <Provider onLogout={handleLogout}/>:<Navigate to="/" />} /> 
                <Route path="/register" element={userRole === '1' ? <Register onRegister={handleRegister} /> : <Navigate to="/" />} />                               
            </Routes>
        </Router>
    );
};

export default App;

