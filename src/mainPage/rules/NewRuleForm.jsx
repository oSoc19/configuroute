import React from "react";
import { Form, Label } from "semantic-ui-react";

class NewRuleForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ruleType: "",
      key: "",
      value: "",
      conclusion: "",
      order: ""
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
        />
      );
    } else {
      let label = this.props.ruleOptions[this.state.ruleType];
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
        />
      );
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

        <Label> Condition </Label>
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
        <Form.Button
          content="Submit"
          onClick={() => {
            this.props.onSubmit(this.state);
          }}
        />
      </Form>
    );
  }
}

export default NewRuleForm;
