import React from "react";
import {
  Form,
  Label,
  Modal,
  Segment,
  Grid,
  Button,
  Divider
} from "semantic-ui-react";
import BackButton from "../../landingPage/BackButton";
import ConfirmButton from "../../landingPage/ConfirmButton";
import "../../landingPage/landingPage.css";

class NewRuleForm extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.selectOptions);
    this.state = {
      showModal: true,
      ruleType: "hasAccessRules",
      key: "osm:access",
      value: "osm:Customers",
      conclusion: true,
      order: 1
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleChangeChecked = e =>
    this.setState({ conclusion: !this.state.conclusion });

  form() {
    const ruleTypeOptions = Object.keys(this.props.ruleTypes).map(k => {
      return {
        key: k,
        value: k,
        text: k
      };
    });

    const keyOptions = Object.keys(this.props.selectOptions).map(k => {
      return {
        key: k,
        value: k,
        text: k
      };
    });

    var prefix = "https://w3id.org/openstreetmap/terms#";
    const valueOptions = Object.keys(this.props.selectOptions[this.state.key])
      .map(entity => {
        return entity.slice(prefix.length);
      })
      .map(entityName => {
        var k = "osm:" + entityName;
        return {
          key: k,
          value: k,
          text: k
        };
      });

    let conclusionForm;
    if (this.props.ruleTypes[this.state.ruleType].type === "number") {
      conclusionForm = (
        <Form.Input
          type="number"
          name="conclusion"
          placeholder={this.props.ruleTypes[this.state.ruleType].conclusion}
          label="conclusion"
          onChange={this.handleChange}
          value={this.state.conclusion}
        />
      );
    } else if (this.state.ruleType !== "") {
      let label = this.props.ruleTypes[this.state.ruleType]["conclusion"];
      conclusionForm = (
        <Form.Checkbox
          name="conclusion"
          placeholder={label}
          label={label}
          onChange={this.handleChangeChecked}
          checked={this.state.conclusion}
          slider
        />
      );
    } else {
      conclusionForm = null;
    }

    return (
      <Form>
        <Form.Select
          name="ruleType"
          placeholder="Type of rule"
          label="Rule"
          options={ruleTypeOptions} //TODO: change it
          onChange={this.handleChange}
          value={this.state.ruleType}
        />

        <Form.Group>
          <Form.Select
            name="key"
            placeholder="Condition key"
            label="key"
            options={keyOptions}
            onChange={this.handleChange}
            value={this.state.key}
          />
          <Form.Select
            name="value"
            placeholder="Condition value"
            label="value"
            options={valueOptions}
            onChange={this.handleChange}
            value={this.state.value}
          />
        </Form.Group>
        <Form.Group />
        {conclusionForm}
        <Form.Input
          name="order"
          placeholder="Order of priority"
          label="Order of priority"
          onChange={this.handleChange}
          value={this.state.order}
        />
        {this.state.showErrorMessage && (
          <Segment>
            {" "}
            <Label> All field values must be completed </Label>
          </Segment>
        )}
      </Form>
    );
  }

  content = () => {
    return (
      <Grid centered style={{ height: "100%", margin: 0 }}>
        <Grid.Row
          columns={1}
          stretched
          style={{ height: "50%", padding: "12px" }}
        >
          <Grid.Column className="contentColumn">{this.form()} </Grid.Column>
        </Grid.Row>
        <Grid.Row
          columns={2}
          stretched
          style={{ height: "50px", padding: "0" }}
        >
          <Button.Group style={{ width: "100%" }}>
            <BackButton onClick={this.props.onClose} />
            <Button.Or />
            <ConfirmButton
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
                  this.props.onSubmit(this.state);
                }
              }}
            />
          </Button.Group>
        </Grid.Row>
      </Grid>
    );
  };

  render() {
    // TODO: required not working ?
    return (
      <Modal open={this.props.showModal} style={{ "border-radius": "12px" }}>
        <this.content />
      </Modal>
    );
  }
}

export default NewRuleForm;
