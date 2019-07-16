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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasUpdated: false,
      configFile: {}
    };
  }

  handleFileConfirm = configFile => {
    this.setState({ configFile: configFile, hasUpdated: true });
  };

  render() {
    return (
      <div className="App">
        <LandingPage onConfirm={this.handleFileConfirm} />
        <Header />
        <div className="App-content">
          <LeftPanel
            hasUpdated={this.state.hasUpdated}
            configFile={this.state.configFile}
          />
          <RightPanel />
        </div>
      </div>
    );
  }
}

export default App;
