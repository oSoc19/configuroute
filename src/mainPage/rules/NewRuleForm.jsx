import React from "react";
import { Form, Label, Modal, Segment } from "semantic-ui-react";

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
      ruleType: "",
      key: "",
      value: "",
      conclusion: "",
      order: 1,
      showErrorMessage: false
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleChangeChecked = e =>
    this.setState({ conclusion: !this.state.conclusion });

  render() {
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

    // TODO: required not working ?
    return (
      <Modal
        open={this.props.showModal}
        contentLabel="New rule form"
        style={customModalStyle}
      >
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
          <Form.Button
            content="Submit"
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
        </Form>
      </Modal>
    );
  }
}

export default NewRuleForm;
