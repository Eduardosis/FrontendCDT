import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import '../Css/NavBar.css';
import logo from "../../assets/img/cdtlogo.png";
import { logout } from '../Apis/api';

const NavBar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };

  const goToViewClients = () => {
    navigate('/provider-view-clients'); // Define esta ruta
    toggleMenu();
  };

  const goToViewWarehouses = () => {
    navigate('/provider-view-warehouses');  // Define esta ruta
    toggleMenu();
  };
  
  const ProviderProfile = () => {
    navigate('/provider-change-password');  // Define esta ruta
    toggleMenu();
  };

  return (
    <div>
      <Navbar expand="lg" className="navbar-custom">
        <Container fluid>
          <Navbar.Brand href="/provider-dashboard">
            <img
              alt=""
              src={logo}
              width="60"
              height="60"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <h5 className="title"></h5>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMenu} />
          <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
            <Nav>
              <Nav.Link href="#">
                <div className="menu-icon" onClick={toggleMenu}>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-icon close-icon" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul>
          <li>
            <Link to="/provider-dashboard" onClick={toggleMenu}>
              Panel Principal
            </Link>
          </li>
          <li>
            <Link to="/provider-profile" onClick={ProviderProfile}>
              Perfil
            </Link>
          </li>
          <li>
            <Link to="/provider-view-clients" onClick={goToViewClients}>
              Ver Clientes
            </Link>
          </li>
          <li>
            <Link to="/provider-view-warehouses" onClick={goToViewWarehouses}>
              Ver Almacenes
            </Link>
          </li>
          <li className="logout-link">
            <Link onClick={handleLogout}>
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
