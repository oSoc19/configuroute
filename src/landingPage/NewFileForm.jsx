import React from "react";
import { Form, Grid, Button } from "semantic-ui-react";
import BackButton from "./BackButton.jsx";
import ConfirmButton from "./ConfirmButton.jsx";

class NewConfigFileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      maxSpeed: "",
      usePublicTransport: ""
    };
  }

  onNewConfigFileCreation = formValues => {
    var ruleTypes = this.props.modal.state.ruleTypes;
    var configFile = {};
    // Given by the form
    configFile["rdfs:label"] = formValues.description;
    configFile["hasMaxSpeed"] = formValues.maxSpeed;
    configFile["usePublicTransport"] = formValues.usePublicTransport;
    // creation of default rules for each type of rule
    Object.keys(ruleTypes).map(k => {
      configFile[k] = [];

      var defaultRule = {};
      defaultRule["concludes"] = {};
      defaultRule["concludes"][ruleTypes[k]["conclusion"]] =
        ruleTypes[k]["defaultValue"];

      configFile[k].push(defaultRule);
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
          label="Maximum speed"
          placeholder="Speed in km/h"
          name="maxSpeed"
          value={maxSpeed}
          onChange={this.handleChange}
          required
        />
        <Form.Checkbox
          label="Use public transport"
          onChange={this.handleChange}
          value={usePublicTransport}
        />
      </Form>
    );
  }

  render() {
    return (
      <Grid centered>
        <Grid.Row columns={1} stretched style={{ height: "80%", padding: "0" }}>
          <Grid.Column className="contentColumn">{this.form()}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} stretched style={{ height: "20%", padding: "0" }}>
          <Button.Group style={{ width: "100%" }}>
            <BackButton
              onClick={() => {
                this.props.modal.handleChangeContent("INDEX", {});
              }}
            />
            <Button.Or />
            <ConfirmButton
              disabled={false}
              onClick={() => {
                this.props.modal.handleConfirm(
                  this.onNewConfigFileCreation(this.state)
                );
              }}
            />
          </Button.Group>
        </Grid.Row>
      </Grid>
    );
  }
}
export default NewConfigFileForm;
