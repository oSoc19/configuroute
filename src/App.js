import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "semantic-ui-react";
import LandingPage from "./landingPage/LandingPage.js"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Our project is going to be awsome</p>
        <LandingPage />
      </header>
      <div>
        <Button content="Primary" primary />
        <Button content="Secondary" secondary />
      </div>
    </div>
  );
}

export default App;
