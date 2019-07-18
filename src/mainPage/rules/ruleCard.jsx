import React from "react";
import {
  Card,
  Button,
  Icon,
  Input,
  Checkbox,
  Segment,
  Modal
} from "semantic-ui-react";

class RuleCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };
  }

  handleChange = (e, { value, checked }) => {
    if (value === undefined) {
      this.props.onChange(this.props.type, this.props.index, checked);
    } else {
      this.props.onChange(this.props.type, this.props.index, value);
    }
  };

  content() {
    var key = 0;
    var option;
    // for now only take the first key
    var conclusion = Object.keys(this.props.rule.concludes)[0];
    switch (typeof this.props.rule.concludes[conclusion]) {
      case "string":
      case "number":
        option = (
          <Input
            type="number"
            value={this.props.rule.concludes[conclusion]}
            onChange={this.handleChange}
          />
        );
        break;
      case "boolean":
        option = (
          <Checkbox
            toggle
            checked={this.props.rule.concludes[conclusion]}
            onChange={this.handleChange}
          />
        );
        break;
      default:
        option = null;
        break;
    }
    key++;
    return (
      <Segment>
        {" "}
        {conclusion} {option}{" "}
      </Segment>
    );
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  render() {
    var header;
    if (this.props.rule.match) {
      header =
        this.props.rule.match.hasPredicate +
        " - " +
        this.props.rule.match.hasObject;
    } else {
      header = "Default rule";
    }
    return (
      <Card fluid>
        <Card.Content>
          {" "}
          <Card.Header> {header} </Card.Header>
        </Card.Content>
        <Card.Content>{this.content()}</Card.Content>
        <Card.Content>
          {" "}
          <Button.Group style={{ width: "100%" }}>
            <Button
              onClick={() => {
                this.props.onDelete(this.props.type, this.props.index);
              }}
              icon
              disabled={header === "Default rule"}
            >
              <Icon name="trash alternate outline" />
            </Button>
            <Button.Or />
            <Button
              onClick={() => {
                this.handleOpenModal();
              }}
              icon
            >
              <Icon name="code" />
            </Button>
          </Button.Group>{" "}
          <Modal open={this.state.showModal}>
            {" "}
            {JSON.stringify(this.props.rule, null, 4)}{" "}
            <Button onClick={this.handleCloseModal} icon>
              {" "}
              <Icon name="close"> </Icon>
            </Button>
          </Modal>
        </Card.Content>
      </Card>
    );
  }
}

export default RuleCard;
