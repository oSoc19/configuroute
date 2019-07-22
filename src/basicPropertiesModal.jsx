import React from "react";
import { Modal, Grid, Button, Form } from "semantic-ui-react";
import BackButton from "./landingPage/BackButton";
import ConfirmButton from "./landingPage/ConfirmButton";

export default class BasicPropertiesModal extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.transport);
    this.state = {
      label: props.label,
      speed: props.speed,
      transport: props.transport,
      modified: false
    };
  }

  handleChange = (e, { name, value, checked }) => {
    if (name === "transport") {
      this.setState({ transport: checked, modified: true });
    } else {
      this.setState({ [name]: value, modified: true });
    }
  };

  form = () => {
    return (
      <Form>
        <Form.Input
          name="label"
          label="description:"
          onChange={this.handleChange}
          value={this.state.label}
          required
        />
        <Form.Input
          type="number"
          name="speed"
          label="maximum speed:"
          onChange={this.handleChange}
          value={this.state.speed}
          required
        />
        <Form.Checkbox
          name="transport"
          label="can be taken on public transport:"
          onChange={this.handleChange}
          checked={this.state.transport}
          slider
        />
      </Form>
    );
  };
  render() {
    return (
      <Modal open={this.props.isOpen}>
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
                disabled={!this.state.modified}
                label="Update properties"
                onClick={() => {
                  this.props.onConfirm(this.state);
                }}
              />
            </Button.Group>
          </Grid.Row>
        </Grid>
      </Modal>
    );
  }
}
