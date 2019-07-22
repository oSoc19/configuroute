import React from "react";
import {
  Item,
  Button,
  Icon,
  Input,
  Checkbox,
  Segment
} from "semantic-ui-react";
import ConfigFileModal from "../ConfigFileModal";

class RuleItem extends React.Component {
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
    var option;
    // for now only take the first key
    var conclusion = Object.keys(this.props.rule.concludes)[0];
    switch (typeof this.props.rule.concludes[conclusion]) {
      case "string":
        option = (
          <Input
            value={this.props.rule.concludes[conclusion]}
            onChange={this.handleChange}
          />
        );
        break;
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
      header = header.replace(/osm:/g, "");
    } else {
      header = "Default rule";
    }

    if (!this.props.display) return null;
    return (
      <Item>
        <Item.Content>
          {" "}
          <Item.Header> {header} </Item.Header>
          <Item.Description />
          <Item.Meta>
            {" "}
            {this.content()}
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
          </Item.Meta>
          {this.state.showModal && (
            <ConfigFileModal
              open={this.state.showModal}
              onClose={() => {
                this.setState({ showModal: false });
              }}
              configFile={this.props.rule}
            />
          )}
        </Item.Content>
      </Item>
    );
  }
}

export default RuleItem;
