import React from "react";
import { Form, Grid, Button, Segment } from "semantic-ui-react";
import BackButton from "./BackButton.jsx";
import ConfirmButton from "./ConfirmButton.jsx";

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
      showErrorMessage: false
    };
  }

  onNewConfigFileCreation = formValues => {
    var ruleTypes = this.props.ruleTypes;
    var configFile = configFileContext;
    // Given by the form
    configFile["rdfs:label"] = formValues.description;
    configFile["hasMaxSpeed"] = Number(formValues.maxSpeed);
    configFile["usePublicTransport"] = formValues.usePublicTransport;
    // creation of default rules for each type of rule
    Object.keys(this.props.ruleTypes).map(k => {
      configFile[k] = [];

      var defaultRule = {};
      defaultRule["concludes"] = {};
      defaultRule["concludes"][ruleTypes[k]["conclusion"]] =
        ruleTypes[k]["defaultValue"];

      configFile[k].push(defaultRule);

      return k;
    });

    return configFile;
  };
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  form() {
    const { description, maxSpeed, usePublicTransport } = this.state;
    return (
      <Form>
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
          <Segment> All field values must be completed</Segment>
        )}
      </Form>
    );
  }

  render() {
    return (
      <Grid centered>
        <Grid.Row columns={1} stretched style={{ height: "80%", padding: "0" }}>
          <Grid.Column className="contentColumn">{this.form()} </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} stretched style={{ height: "20%", padding: "0" }}>
          <Button.Group style={{ width: "100%" }}>
            <BackButton
              onClick={() => {
                this.props.onChangeContent("INDEX");
              }}
            />
            <Button.Or />
            <ConfirmButton
              disabled={false}
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
                  this.props.onConfirm(
                    this.onNewConfigFileCreation(this.state)
                  );
                }
              }}
            />
          </Button.Group>
        </Grid.Row>
      </Grid>
    );
  }
}
export default NewConfigFileForm;
