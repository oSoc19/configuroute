import React from "react";
import MainContent from "./mainPage/MainContent";
import LandingPage from "./landingPage/LandingPage.jsx";
import "./App.css";
import logo from "./assets/logo.jpg";

function Header() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <span className="App-header"> Configuroute </span>
    </header>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configFile: ""
    };
  }

  handleFileConfirm = configFile => {
    this.setState({ configFile: configFile });
    console.log(configFile);
  };

  render() {
    return (
      <div className="App">
        <LandingPage onConfirm={this.handleFileConfirm} />
        <Header />
        <MainContent />
      </div>
    );
  }
}

export default App;
