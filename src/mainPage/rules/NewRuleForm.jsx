import React from "react";
import {
  Form,
  Label,
  Modal,
  Segment,
  Grid,
  Button,
  Divider,
  Image,
  Item
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
      ruleType: "",
      key: "",
      value: "",
      conclusion: false,
      order: 1
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleChangeChecked = e =>
    this.setState({ conclusion: !this.state.conclusion });

  getTagDescription = () => {
    var description = this.props.selectOptions.tags[this.state.key].description;
    var comment = "";
    Object.keys(description).map(key => {
      if (key.slice(key.indexOf("#") + 1) === "comment") {
        comment = description[key];
      }
    });
    return comment;
  };

  getValueDescription = () => {
    var description = this.props.selectOptions.values[
      this.state.value.slice(4)
    ];
    var comment = "";
    Object.keys(description).map(key => {
      if (key.slice(key.indexOf("#") + 1) === "comment") {
        comment = description[key];
      }
    });
    return comment;
  };

  getTagLink = () => {
    var description = this.props.selectOptions.tags[this.state.key].description;
    var link = "";
    Object.keys(description).map(key => {
      if (key.slice(key.indexOf("#") + 1) === "wasInfluencedBy") {
        link = description[key];
      }
    });
    return link;
  };

  getValueLink = () => {
    var description = this.props.selectOptions.values[
      this.state.value.slice(4)
    ];
    var link = "";
    Object.keys(description).map(key => {
      if (key.slice(key.indexOf("#") + 1) === "wasInfluencedBy") {
        link = description[key];
      }
    });
    return link;
  };

  form() {
    const ruleTypeOptions = Object.keys(this.props.ruleTypes).map(k => {
      return {
        key: k,
        value: k,
        text: k
      };
    });

    var tags = this.props.selectOptions.tags;
    const keyOptions = Object.keys(this.props.selectOptions.tags).map(k => {
      return {
        key: k,
        value: k,
        text: k
      };
    });

    var prefix = "https://w3id.org/openstreetmap/terms#";
    const valueOptions = this.state.key
      ? tags[this.state.key].values.map(valueName => {
          var k = "osm:" + valueName;
          return {
            key: k,
            value: k,
            text: k
          };
        })
      : [];

    let conclusionForm;
    if (
      this.state.ruleType &&
      this.props.ruleTypes[this.state.ruleType].type === "number"
    ) {
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
    } else if (this.state.ruleType) {
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
      <React.Fragment>
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
        <Item.Group divided relaxed>
          {this.state.key && (
            <Item>
              <Item.Content>
                <Item.Header as="a" href={this.getTagLink()} target="_blank">
                  {this.state.key}
                </Item.Header>
                <Item.Meta>Description</Item.Meta>
                <Item.Description>{this.getTagDescription()}</Item.Description>
              </Item.Content>
            </Item>
          )}

          {this.state.value && (
            <Item>
              <Item.Content>
                <Item.Header as="a" href={this.getValueLink()} target="_blank">
                  {this.state.value}
                </Item.Header>
                <Item.Meta>Description</Item.Meta>
                <Item.Description>
                  {this.getValueDescription()}
                </Item.Description>
              </Item.Content>
            </Item>
          )}
        </Item.Group>
      </React.Fragment>
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
