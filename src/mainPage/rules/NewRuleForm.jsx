import React from "react";
import {
  Form,
  Label,
  Modal,
  Segment,
  Grid,
  Button,
  Confirm,
  Message
} from "semantic-ui-react";
import BackButton from "../../landingPage/BackButton";
import ConfirmButton from "../../landingPage/ConfirmButton";
import "../../landingPage/landingPage.css";

const customModalStyle = {
  content: {
    width: "80%",
    height: "80%",
    padding: "0",
    borderRadius: "12px",
    outline: "none",
    border: "none",
    top: "50%",
    left: "50%",
    position: "absolute",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  }
};

class NewRuleForm extends React.Component {
  constructor(props) {
    super(props);

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
    const ruleTypeOptions = Object.keys(this.props.ruleOptions).map(k => {
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

    const prop = this.props.selectOptions[this.state.key];
    const valueOptions =
      prop === undefined
        ? []
        : prop.map(val => {
            return {
              key: val,
              value: val,
              text: val
            };
          });

    let conclusionForm;
    if (
      this.state.ruleType === "hasPriorityRules" ||
      this.state.ruleType === "hasSpeedRules"
    ) {
      conclusionForm = (
        <Form.Input
          name="conclusion"
          placeholder={
            this.state.ruleType === "hasPriorityRules"
              ? "priority level"
              : "speed"
          }
          label="conclusion"
          onChange={this.handleChange}
          value={this.state.conclusion}
          required={true}
        />
      );
    } else if (this.state.ruleType !== "") {
      let label = this.props.ruleOptions[this.state.ruleType]["conclusion"];
      conclusionForm = (
        <Form.Checkbox
          name="conclusion"
          placeholder={label}
          label={label}
          onChange={this.handleChangeChecked}
          checked={
            typeof this.state.conclusion === "string"
              ? false
              : this.state.conclusion
          }
          slider
          required={true}
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
          required={true}
        />

        <Label> Condition </Label>
        <Form.Group>
          <Form.Select
            name="key"
            placeholder="Condition key"
            label="key"
            options={keyOptions}
            onChange={this.handleChange}
            value={this.state.key}
            required={true}
          />
          <Form.Select
            name="value"
            placeholder="Condition value"
            label="value"
            options={valueOptions}
            onChange={this.handleChange}
            value={this.state.value}
            required={true}
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
        {this.props.triggerMessage && (
          <Message>
            This precise rule (type, key and value) already exists
          </Message>
        )}
      </Form>
    );
  }

  content = () => {
    return (
      //TODO: problem: style is not applied
      <Grid centered>
        <Grid.Row columns={1} stretched style={{ height: "50%", padding: "0" }}>
          <Grid.Column className="contentColumn">{this.form()} </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} stretched style={{ height: "50%", padding: "0" }}>
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
      <Modal open={this.props.showModal} style={customModalStyle}>
        <this.content />
      </Modal>
    );
  }
}

export default NewRuleForm;
