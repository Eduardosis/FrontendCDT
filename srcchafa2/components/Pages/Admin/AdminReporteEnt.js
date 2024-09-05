
import React, { useState, useEffect } from "react";
import TrackingBar from "./TrackingBar";
import '../../Css/admin.css';
import NavBarNoMenu from '../../NavBar/NavBarNoMenu';
import Footer from '../../Footer/Footer';

const ReporteEntrega = () => {


  return (
<div>
<NavBarNoMenu />
   
<div className="form-container">
  <h1>Entrega H1</h1>
  <div className="linea">
    <h2>Seguimiento de Envío</h2>
    <TrackingBar />
  </div>
<form className="form">
  <div className="leftColumn">
    <div className="field">
      <label htmlFor="estatus" className="label">Estatus</label>
      <input type="text" id="estatus" name="estatus" className="input" />
    </div>
    <div className="field">
      <label htmlFor="producto" className="label">Producto</label>
      <input type="text" id="producto" name="producto" className="input" />
    </div>
    <div className="field">
      <label  htmlFor="cantidad" className="label">Cantidad</label>
      <input type="number" id="cantidad" name="cantidad" className="input" />
    </div>
    <div className="field">
      <label  htmlFor="cantidad" className="label">Almacen</label>
      <input type="text" id="almacen" name="almacen" className="input" />
     </div>
    <div className="field">
      <label htmlFor="ruta" className="label">Recibido por</label>
      <input type="text" id="ruta" name="ruta" className="input" />
    </div>
  </div>
  <div className="rightColumn">
    <div className="field">
      <label htmlFor="descripcion" className="label">Descripción</label>
      <textarea id="descripcion" name="descripcion" rows="5" className="input textarea"></textarea>
    </div>
  </div>
</form>
</div>
</div> 
  );
};

export default ReporteEntrega;