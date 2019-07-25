import React from "react";
import LandingPage from "./landingPage/LandingPage.jsx";
import LeftPanel from "./mainPage/LeftPanel.jsx";
import RightPanel from "./mainPage/RightPanel.jsx";
import OntologyReader from "./lib/OntologyReader";
import "./App.css";
import logo from "./assets/logo.jpg";

/**
 * This file is the entry point of our web application, it contains the central
 * component, which is the ancester of all other parents. In particular,
 * it manages the state of the configuration file.
 */

/**
 * The properties defines the general tag properties giving information about
 * the roads.
 */
const properties = [
  "access",
  "barrier",
  "bicycle",
  "construction",
  "crossing",
  "cycleway",
  "footway",
  "highway",
  "motor_vehicle",
  "motorcar",
  "oneway_bicycle",
  "oneway",
  "smoothness",
  "surface",
  "tracktype",
  "vehicle"
];

/**
 * This object is the key data structure which encompass metadata about the type
 * of rules that can be defined in a transport profile, since the porfile ontoogy
 * is not yet read dybamically. Meanwhile, by updating this datastructure, the
 * rest of the code should adapt automatically.
 */
const typesOfRuleMetadata = {
  hasAccessRules: {
    conclusion: "hasAccess", // what to conclude if this tag of rule is selected
    type: "boolean", // "typeof" conclusion
    defaultValue: false,
    description: "Determines whether or not a way is accessible."
  },
  hasObstacleRules: {
    conclusion: "isObstacle",
    type: "boolean",
    defaultValue: true,
    description: "Determines whether or not a node can be traversed."
  },
  hasOnewayRules: {
    conclusion: "isOneway",
    type: "boolean",
    defaultValue: true,
    description: "Determines whether or not something is a oneway street."
  },
  hasPriorityRules: {
    conclusion: "hasPriority",
    type: "number",
    defaultValue: 1,
    description:
      "Determines an additional multiplier that will be used to demote/promote certain road."
  },
  hasSpeedRules: {
    conclusion: "hasSpeed",
    type: "number",
    defaultValue: 10,
    description: "Determines the maximum speed on a street."
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      configFile: {},
      showLandingPage: true,
      leftLoaded: false,
      ontology: {}
    };
  }

  /**
   *
   * @param {*} configFile
   * ConfiguRoute fetches the terms used inside a profile dynamically from the OSM
   * inspired ontology (http://hdelva.be/tiles/ns/terms.html) using the
   * array of properties defined at the beginning of this file.
   */
  async queryOntologyForInformation(configFile) {
    var engine = new OntologyReader("http://hdelva.be/tiles/ns/ontology");
    const sourceURL = "https://w3id.org/openstreetmap/terms#";
    var ontology = {
      tags: {}, // set of all tags/properties ->
      values: {} // set of all possible values
    };

    properties.map(property => {
      ontology.tags[property] = {
        values: [], // the range of possible values that can be associated to the given tag/property
        description: {} // a description of the given property
      };
      return ontology;
    });

    for (var tag of Object.keys(ontology.tags)) {
      // fetching the range of possible values
      ontology.tags[tag].values = (await engine.getNamedIndividualsForProperty(
        sourceURL + tag
      )).map(value => {
        return value.slice(sourceURL.length); // removing the sourceUrl prefix
      });
      // fetching the description of the tag/property
      ontology.tags[tag].description = await engine.getEntityDescription(
        sourceURL + tag
      );

      // for each value, fetch its description
      for (var value of ontology.tags[tag].values) {
        ontology.values[value] = await engine.getEntityDescription(
          sourceURL + value
        );
      }
    }

    this.setState({
      showLandingPage: false,
      ontology: ontology,
      configFile: configFile,
      leftLoaded: true
    });
  }

  /**
   * Called when a configuration file is submitted from the landing page
   */
  handleFileConfirm = configFile => {
    this.queryOntologyForInformation(configFile);
  };

  /**
   * Called when the user wants to add a new rule to the configuration file.
   */
  handleNewRuleSubmit = form => {
    // add back the osm prefix from the terms because it was removed when displayed to the user
    form.value = "osm:" + form.value;
    form.key = "osm:" + form.key;
    var configFile = { ...this.state.configFile };
    var isANewRule = true;
    var conclusionLabel = typesOfRuleMetadata[form.ruleType].conclusion;

    // check if this rule is not already present in the configuration file
    this.state.configFile[form.ruleType].map(rule => {
      if (
        // if yes, simply update its conclusion value
        rule["match"] &&
        rule["match"]["hasPredicate"] === form.key &&
        rule["match"]["hasObject"] === form.value
      ) {
        var index = configFile[form.ruleType].indexOf(rule);
        configFile[form.ruleType][index].concludes[conclusionLabel] =
          form.conclusion;
        isANewRule = false;
        return false;
      }
      return true;
    });

    if (isANewRule) {
      if (typesOfRuleMetadata[form.ruleType].type === "number") {
        form.conclusion = parseInt(form.conclusion);
      }

      let newRule = {
        match: {
          hasPredicate: form.key,
          hasObject: form.value
        },
        concludes: {
          [conclusionLabel]: form.conclusion
        },
        hasOrder: form.order
      };

      configFile[form.ruleType].unshift(newRule);
    }
    this.setState({ configFile: configFile, showModal: false });
  };

  /**
   * Called when the user modifies the value of what can be concluded by a given
   * rule.
   *
   * @param {*} type : the type of rule (priorityRule, accesRule, ...)
   * @param {*} index : the position of the rule in the array corresponding to its type
   * @param {*} value : the new value for the conclusion
   *
   */
  handleRuleConclusionChange = (type, index, value) => {
    if (typesOfRuleMetadata[type].type === "number") value = parseInt(value);
    var configFile = { ...this.state.configFile };
    configFile[type][index]["concludes"][
      [typesOfRuleMetadata[type]["conclusion"]]
    ] = value;
    this.setState({ configFile: configFile });
  };

  /**
   * Called when the user wants to delete a rule from the configuration file
   */
  handleRuleDelete = (type, index) => {
    var configFile = { ...this.state.configFile };
    if (index !== configFile[type].length - 1) {
      configFile[type].splice(index, 1);
      this.setState({ configFile: configFile });
    }
  };

  /**
   * Called when the user wants to modify basic properties of the configuration
   * file (non rules properties)
   */
  handleChangeBasicProperties = newProperties => {
    var label = this.state.configFile["rdfs:label"];
    var speed = this.state.configFile["hasMaxSpeed"];
    var transport = this.state.configFile["usePublicTransport"];

    label = newProperties.label ? newProperties.label : label;
    speed = newProperties.speed ? newProperties.speed : speed;
    transport = newProperties.transport ? newProperties.transport : transport;

    var configFile = { ...this.state.configFile };
    configFile["rdfs:label"] = label;
    configFile["hasMaxSpeed"] = parseInt(speed);
    configFile["usePublicTransport"] = transport;
    this.setState({ configFile: configFile });
  };

  render() {
    return (
      <div className="App">
        <LandingPage
          typesOfRuleMetadata={typesOfRuleMetadata}
          onConfirm={this.handleFileConfirm}
          showModal={this.state.showLandingPage}
        />
        <div className="App-content">
          <LeftPanel
            typesOfRuleMetadata={typesOfRuleMetadata}
            rulesSelectOptions={this.state.ontology}
            loaded={this.state.leftLoaded}
            configFile={this.state.configFile}
            onNewRuleSubmit={this.handleNewRuleSubmit}
            onRuleConclusionChange={this.handleRuleConclusionChange}
            onRuleDelete={this.handleRuleDelete}
            onChangeBasicProperties={this.handleChangeBasicProperties}
            className="Left-panel"
          />
          <RightPanel configFile={this.state.configFile} />
        </div>
      </div>
    );
  }
}

export default App;
