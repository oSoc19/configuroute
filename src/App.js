import React from "react";
import MainContent from "./mainPage/MainContent";
import LandingPage from "./landingPage/LandingPage.js";
import "./App.css";
import logo from "./assets/logo.jpg";

function Header() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" />
      <span className="App-header"> Configuroute </span>
    </header>
  );
}

function App() {
  return (
    <div className="App">
      {/*<LandingPage />*/}
      <Header />
      <MainContent />
    </div>
  );
}

export default App;
