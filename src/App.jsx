import React from "react";
import LandingPage from "./landingPage/LandingPage.jsx";
import LeftPanel from "./mainPage/LeftPanel.jsx";
import RightPanel from "./mainPage/RightPanel.jsx";
import "./App.css";
import logo from "./assets/logo.jpg";

const ruleTypes = {
  hasAccessRules: {
    conclusion: "hasAccess",
    defaultValue: false
  },
  hasObstacleRules: {
    conclusion: "isObstacle",
    defaultValue: true
  },
  hasOnewayRules: {
    conclusion: "isOneway",
    defaultValue: true
  },
  hasPriorityRules: {
    conclusion: "isReversed",
    defaultValue: 0
  },
  hasSpeedRules: {
    conclusion: "hasSpeed",
    defaultValue: 35
  }
};

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
      configFile: {}
    };
  }

  handleFileConfirm = configFile => {
    this.setState({ configFile: configFile });
  };

  handleNewRuleSubmit = formValues => {
    var isANewRule = true;
    this.state.configFile[formValues.ruleType].map(rule => {
      if (
        rule["match"] &&
        rule["match"]["hasPredicate"] === formValues.key &&
        rule["match"]["hasObject"] === formValues.value
      ) {
        isANewRule = false;
        return false;
      }
      return true;
    });

    if (isANewRule) {
      var configFile = { ...this.state.configFile };
      var conclusionLabel = ruleTypes[formValues.ruleType].conclusion;

      let newRule = {
        match: {
          hasPredicate: formValues.key,
          hasObject: formValues.value
        },
        concludes: {
          [conclusionLabel]: formValues.conclusion
        },
        hasOrder: formValues.order
      };

      configFile[formValues.ruleType].unshift(newRule);
      this.setState({ configFile: configFile, showModal: false });
    } else {
      this.setState({ triggerMessage: true });
    }
  };

  handleRuleConclusionChange = (type, index, value) => {
    var configFile = { ...this.state.configFile };
    configFile[type][index]["concludes"][
      [ruleTypes[type]["conclusion"]]
    ] = value;
    this.setState({ configFile: configFile });
  };

  handleRuleDelete = (type, index) => {
    var configFile = { ...this.state.configFile };
    if (index !== configFile[type].length - 1) {
      configFile[type].splice(index, 1);
      this.setState({ configFile: configFile });
    }
  };

  render() {
    return (
      <div className="App">
        <LandingPage onConfirm={this.handleFileConfirm} />
        <Header />
        <div className="App-content">
          <LeftPanel
            onNewRuleSubmit={this.handleNewRuleSubmit}
            onRuleConclusionChange={this.handleRuleConclusionChange}
            onRuleDelete={this.handleRuleDelete}
            configFile={this.state.configFile}
            onConfigFileChange={this.state.handelConfirm}
            className="Left-panel"
          />
          <RightPanel configFile={this.state.configFile} />
        </div>
      </div>
    );
  }
}

export default App;
