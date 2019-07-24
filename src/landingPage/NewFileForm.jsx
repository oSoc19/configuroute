import React from "react";
import {
  Form,
  Message,
  Dimmer,
  Loader,
  Icon,
  Divider
} from "semantic-ui-react";

/* JSON-LD information about terms used in configuration file */
const configFileContext = {
  "@context": {
    osm: "https://w3id.org/openstreetmap/terms#",
    opp: "https://w3id.org/openplannerteam/profile#",
    prov: "http://www.w3.org/ns/prov#",
    hasMaxSpeed: {
      "@id": "opp:hasMaxSpeed"
    },
    usePublicTransport: {
      "@id": "opp:usePublicTransport"
    },
    hasAccessRules: {
      "@id": "opp:hasAccessRules"
    },
    hasOnewayRules: {
      "@id": "opp:hasOnewayRules"
    },
    hasSpeedRules: {
      "@id": "opp:hasSpeedRules"
    },
    hasPriorityRules: {
      "@id": "opp:hasPriorityRules"
    },
    hasObstacleRules: {
      "@id": "opp:hasObstacleRules"
    },
    hasAccess: {
      "@id": "opp:hasAccess"
    },
    isOneway: {
      "@id": "opp:isOneway"
    },
    isReversed: {
      "@id": "opp:isReversed"
    },
    hasSpeed: {
      "@id": "opp:hasSpeed"
    },
    isObstacle: {
      "@id": "opp:isObstacle"
    },
    hasPriority: {
      "@id": "opp:hasPriority"
    },
    concludes: {
      "@id": "opp:concludes"
    },
    hasOrder: {
      "@id": "opp:hasOrder"
    },
    match: {
      "@id": "opp:match"
    },
    fromProperty: {
      "@id": "opp:fromProperty",
      "@type": "@id"
    },
    hasPredicate: {
      "@id": "opp:hasPredicate",
      "@type": "@id"
    },
    hasObject: {
      "@id": "opp:hasObject",
      "@type": "@id"
    }
  }
};
class NewConfigFileForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
      maxSpeed: "",
      usePublicTransport: false,
      showErrorMessage: false,
      dimmerActive: false
    };
  }

  onNewConfigFileCreation = formValues => {
    var typesOfRuleMetadata = this.props.typesOfRuleMetadata;
    var configFile = configFileContext;
    // Given by the form
    configFile["rdfs:label"] = formValues.description;
    configFile["hasMaxSpeed"] = Number(formValues.maxSpeed);
    configFile["usePublicTransport"] = formValues.usePublicTransport;
    // creation of default rules for each type of rule
    Object.keys(this.props.typesOfRuleMetadata).map(k => {
      configFile[k] = [];

      var defaultRule = {};
      defaultRule["concludes"] = {};
      defaultRule["concludes"][typesOfRuleMetadata[k]["conclusion"]] =
        typesOfRuleMetadata[k]["defaultValue"];
      defaultRule["hasOrder"] = 100;

      configFile[k].push(defaultRule);

      return k;
    });

    return configFile;
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  form() {
    const { description, maxSpeed, usePublicTransport } = this.state;
    return (
      <Form inverted>
        <Form.Input
          label="Description"
          placeholder="Vehicle profile for..."
          name="description"
          value={description}
          onChange={this.handleChange}
          required
        />

        <Form.Input
          type="number"
          label="Maximum speed"
          placeholder="Speed in km/h"
          name="maxSpeed"
          value={maxSpeed}
          onChange={this.handleChange}
          required
        />
        <Form.Checkbox
          label="Use public transport"
          onChange={() => {
            this.setState({ usePublicTransport: !usePublicTransport });
          }}
          checked={usePublicTransport}
        />
        {this.state.showErrorMessage && (
          <Message negative>
            <Message.Header>All field values must be filled in</Message.Header>
            <p>Enter a description and the maximum speed of the vehicle.</p>
          </Message>
        )}
      </Form>
    );
  }

  /**
   * This function reads the content of a configuration file from a URL location
   * as text, parse it and submit it to the App component.
   */
  startFromProfile(reactComponent, profile_url) {
    var request = new XMLHttpRequest();
    request.open("GET", profile_url, true);
    request.send(null);
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        var type = request.getResponseHeader("Content-Type");
        if (type.indexOf("text") !== 1) {
          reactComponent.props.onConfirm(JSON.parse(request.responseText));
        } else {
          alert("Error happened: link to file modified or removed!");
        }
      }
    };
    this.setState({ dimmerActive: true });
  }

  render() {
    return (
      <div>
        <Dimmer active={this.state.dimmerActive}>
          <Loader size="huge">Loading</Loader>
        </Dimmer>
        <div className="new_file_from">
          <h2 className="color_white">Start from a default profile</h2>
          <div className="profiles_container">
            <button
              className="background_white button_profile"
              name="car"
              onClick={() => {
                this.startFromProfile(
                  this,
                  "https://raw.githubusercontent.com/oSoc19/configuroute/master/default_profiles/car.json"
                );
              }}
            >
              <Icon name="car" size="huge" />
            </button>
            <button
              className="background_white button_profile"
              name="bike"
              onClick={() => {
                this.startFromProfile(
                  this,
                  "https://raw.githubusercontent.com/oSoc19/configuroute/master/default_profiles/bike.json"
                );
              }}
            >
              <Icon name="bicycle" size="huge" />
            </button>
            <button
              className="background_white button_profile"
              name="default profiles"
              onClick={() => {
                this.startFromProfile(
                  this,
                  "https://raw.githubusercontent.com/oSoc19/configuroute/master/default_profiles/pedestrian.json"
                );
              }}
            >
              <Icon name="blind" size="huge" />
            </button>
          </div>
          <Divider inverted horizontal>
            or
          </Divider>
          <h2 className="color_white"> Start from scratch </h2>
          {this.form()}
        </div>
        <div className="horizontalContainer">
          <button
            className="button_secondary color_dark_blue background_white"
            onClick={this.props.onBack}
          >
            <Icon name="arrow left" />
            <span>Go back</span>
          </button>
          <button
            className="button color_white background_green"
            onClick={() => {
              var showErrorMessage = false;
              Object.keys(this.state).map(k => {
                if (this.state[k] === "" || this.state[k] === null) {
                  showErrorMessage = true;
                }
                return k;
              });
              if (showErrorMessage) {
                this.setState({ showErrorMessage: true });
              } else {
                this.setState({ dimmerActive: true });
                this.props.onConfirm(this.onNewConfigFileCreation(this.state));
              }
            }}
          >
            <Icon name="checkmark" style={{ width: "20%" }} size="large" />
            <span style={{ paddingTop: "3px" }}>Confirm selection</span>
          </button>
        </div>
      </div>
    );
  }
}
export default NewConfigFileForm;
