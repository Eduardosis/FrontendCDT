import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../Css/Footer.css'; // Archivo CSS para estilos personalizados

const Footer = () => {
  return (
    <footer className="footer">
      <Container className='footer-c'>
        <Row>
          <Col className="text-left py-3"> {/* Clase modificada */}
            <span>© 2024 CDT Derechos Reservados.</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
