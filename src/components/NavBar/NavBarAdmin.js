import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import '../Css/NavBar.css';
import logo from "../../assets/img/cdtlogo.png";
import { logout } from '../Apis/api';

const NavBarAdmin = ({ onLogout }) => {
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

  const goToViewProviders = () => {
    navigate('/admin-view-providers');
    toggleMenu();
  };

  const goToViewShippingServices = () => {
    navigate('/admin-view-shipping-services');
    toggleMenu();
  };

  return (
    <div>
      <Navbar expand="lg" className="navbar-custom">
        <Container fluid>
          <Navbar.Brand href="/admin">
            <img
              alt=""
              src={logo}
              width="60"
              height="60"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <h1 className="title"></h1>
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
            <Link to="/admin" onClick={toggleMenu}>
              Panel Principal
            </Link>
          </li>
          <li>
            <Link to="/admin-profile" onClick={toggleMenu}>
              Perfil
            </Link>
          </li>
          <li>
            <Link to="/admin-view-providers" onClick={goToViewProviders}>
              Ver Proveedores
            </Link>
          </li>
          <li>
            <Link to="/admin-view-shipping-services" onClick={goToViewShippingServices}>
              Ver Paqueterías
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

export default NavBarAdmin;