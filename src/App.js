import React from "react";
import LandingPage from "./landingPage/LandingPage.jsx";
import LeftPanel from "./mainPage/LeftPanel.jsx";
import RightPanel from "./mainPage/RightPanel.jsx";
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

function MainContent(props) {
  return (
    <div className="App-content">
      <LeftPanel />
      <RightPanel configFile={props.configFile} />
    </div>
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
        <MainContent configFile={this.state.configFile} />
      </div>
    );
  }
}

export default App;
