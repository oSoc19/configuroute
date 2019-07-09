import React from "react";
import logo from "./assets/logo.jpg";
import "./App.css";

function Header() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" />
      <span className="App-header"> Configuroute </span>
    </header>
  );
}

export default Header;
