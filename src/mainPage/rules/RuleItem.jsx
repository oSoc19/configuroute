import React from "react";
import {
  Item,
  Button,
  Icon,
  Input,
  Checkbox,
  Segment,
  Popup
} from "semantic-ui-react";
import DescriptionItem from "./DescriptionItem";

/**
 * Displays one rule of the configuration file. Can be directly modified by the
 * user.
 */
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
      <Segment style={{ marginRight: 0 }}>
        {conclusion} {option}
      </Segment>
    );
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };

  popupContent = () => {
    if (this.props.rule.match) {
      var tag = this.props.rule.match.hasPredicate;
      tag = tag ? tag.slice(4) : tag;
      var value = this.props.rule.match.hasObject;
      value = value ? value.slice(4) : value;
      return (
        <Item.Group>
          {tag && (
            <DescriptionItem
              href={this.props.getTagLink(tag)}
              header={tag}
              description={this.props.getTagComment(tag)}
            />
          )}
          {value && (
            <DescriptionItem
              href={this.props.getValueLink(value)}
              header={value}
              description={this.props.getValueComment(value)}
            />
          )}
        </Item.Group>
      );
    }
    return null;
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
          <h3 className="color_white"> {header} </h3>
          <Item.Description />
          <Item.Meta>
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
              <Popup
                hideOnScroll
                trigger={
                  <Button
                    onClick={() => {
                      this.handleOpenModal();
                    }}
                    icon
                  >
                    <Icon name="info" />
                  </Button>
                }
                content={this.popupContent()}
                on="click"
                open={this.state.showModal}
                onClose={this.handleCloseModal}
                onOpen={this.handleOpenModal}
                position="top right"
              />
            </Button.Group>{" "}
          </Item.Meta>
        </Item.Content>
      </Item>
    );
  }
}

export default RuleItem;
