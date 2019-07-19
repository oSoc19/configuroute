import React from "react";
import LandingPage from "./landingPage/LandingPage.jsx";
import LeftPanel from "./mainPage/LeftPanel.jsx";
import RightPanel from "./mainPage/RightPanel.jsx";
import OntologyReader from "./lib/OntologyReader";
import "./App.css";
import logo from "./assets/logo.jpg";

const properties = {
  "osm:access": [],
  "osm:barrier": [],
  "osm:bicycle": [],
  "osm:construction": [],
  "osm:crossing": [],
  "osm:cycleway": [],
  "osm:footway": [],
  "osm:highway": [],
  "osm:motor_vehicle": [],
  "osm:motorcar": [],
  "osm:oneway_bicycle": [],
  "osm:oneway": [],
  "osm:smoothness": [],
  "osm:surface": [],
  "osm:tracktype": [],
  "osm:vehicle": []
};

const ruleTypes = {
  hasAccessRules: {
    conclusion: "hasAccess",
    type: "boolean",
    defaultValue: false
  },
  hasObstacleRules: {
    conclusion: "isObstacle",
    type: "boolean",
    defaultValue: true
  },
  hasOnewayRules: {
    conclusion: "isOneway",
    type: "boolean",
    defaultValue: true
  },
  hasPriorityRules: {
    conclusion: "hasPriority",
    type: "number",
    defaultValue: 0
  },
  hasSpeedRules: {
    conclusion: "hasSpeed",
    type: "number",
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
      configFile: {},
      showLandingPage: true,
      leftLoaded: false,
      ontology: []
    };
  }

  async queryOntologyForInformation(configFile) {
    var engine = new OntologyReader("http://hdelva.be/tiles/ns/ontology");
    var ontology = { ...properties };
    var keys = Object.keys(ontology);
    for (var i in keys) {
      var entitiesName = await engine.getNamedIndividualsForProperty(
        "https://w3id.org/openstreetmap/terms#" + keys[i].slice(4)
      );
      for (var j in entitiesName) {
        ontology[keys[i]][entitiesName[j]] = await engine.getEntityDescription(
          entitiesName[j]
        );
      }
    }
    this.setState({
      showLandingPage: false,
      ontology: ontology,
      configFile: configFile,
      leftLoaded: true
    });
    console.log(ontology);
  }

  handleFileConfirm = configFile => {
    this.queryOntologyForInformation(configFile);
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
        <LandingPage
          ruleTypes={ruleTypes}
          onConfirm={this.handleFileConfirm}
          showModal={this.state.showLandingPage}
        />
        <Header />
        <div className="App-content">
          <LeftPanel
            ruleTypes={ruleTypes}
            rulesSelectOptions={this.state.ontology}
            loaded={this.state.leftLoaded}
            configFile={this.state.configFile}
            onNewRuleSubmit={this.handleNewRuleSubmit}
            onRuleConclusionChange={this.handleRuleConclusionChange}
            onRuleDelete={this.handleRuleDelete}
            className="Left-panel"
          />
          <RightPanel configFile={this.state.configFile} />
        </div>
      </div>
    );
  }
}

export default App;
