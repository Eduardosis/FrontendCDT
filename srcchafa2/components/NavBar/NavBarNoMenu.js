import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import '../Css/NavBar.css'; // Importa tu archivo CSS si tienes estilos personalizados
import logo from "../../assets/img/cdtlogo.png"; // Ruta relativa desde la ubicación actual al archivo logo.png

const NavBarNoMenu = () => {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            alt=""
            src={logo}
            width="60"
            height="60"
            className="d-inline-block align-top"
          />
          {' '}
        </Navbar.Brand>
        <h1 className="title">CDT</h1>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBarNoMenu;
