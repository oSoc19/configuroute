import React from "react";
import { Form, Label, Checkbox } from "semantic-ui-react";

class NewConfigFileForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "hello",
      maxSpeed: 0,
      usePublicTransport: ""
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
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
export default NewConfigFileForm;
