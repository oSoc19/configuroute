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
import DescriptionItem from "./DescriptionItem";

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
      prefix: "https://w3id.org/openstreetmap/terms#",
      rulesLink: "http://hdelva.be/profile/ns/profile.html#"
    };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleChangeChecked = e =>
    this.setState({ conclusion: !this.state.conclusion });

  getComment = description => {
    var comment = "";
    Object.keys(description).map(key => {
      if (key.slice(key.indexOf("#") + 1) === "comment") {
        comment = description[key];
      }
    });
    return comment;
  };

  getTagDescription = () => {
    var description = this.props.selectOptions.tags[this.state.key].description;
    return this.getComment(description);
  };

  getValueDescription = () => {
    var description = this.props.selectOptions.values[this.state.value];
    return this.getComment(description);
  };

  getLink = description => {
    var link = "";
    Object.keys(description).map(key => {
      if (key.slice(key.indexOf("#") + 1) === "wasInfluencedBy") {
        link = description[key];
      }
    });
    return link;
  };

  getTagLink = () => {
    var description = this.props.selectOptions.tags[this.state.key].description;
    return this.getLink(description);
  };

  getValueLink = () => {
    var description = this.props.selectOptions.values[this.state.value];
    return this.getLink(description);
  };

  insertCharacterInString(string, index, char) {
    if (string.length > index) {
      return string.slice(0, index) + char + string.slice(index);
    }
  }

  beautifyString(stringToChange) {
    var upperCasesIndexes = [];
    var string = stringToChange.slice(0);

    for (var i = 1; i < string.length; i++) {
      var l = upperCasesIndexes.length + i;
      if (i && string[i] === string[i].toUpperCase()) {
        upperCasesIndexes.push(l);
      }
    }

    upperCasesIndexes.map(index => {
      string = this.insertCharacterInString(string, index, " ");
    });
    return string;
  }
  form() {
    const ruleTypeOptions = Object.keys(this.props.ruleTypes).map(k => {
      return {
        key: k,
        value: k,
        text: this.beautifyString(k.slice(3))
      };
    });

    var tags = this.props.selectOptions.tags;
    const keyOptions = Object.keys(tags).map(k => {
      return {
        key: k,
        value: k,
        text: k
      };
    });

    const valueOptions = this.state.key
      ? tags[this.state.key].values.map(valueName => {
          var k = valueName;
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
          required
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
          defaultChecked={false}
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
              placeholder={"Condition value"}
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
        <Item.Group divided>
          {this.state.ruleType && (
            <DescriptionItem
              href={this.state.rulesLink + this.state.ruleType}
              header={this.state.ruleType.slice(3)}
              description={
                this.props.ruleTypes[this.state.ruleType].description
              }
            />
          )}
          {this.state.key && (
            <DescriptionItem
              href={this.getTagLink()}
              header={this.state.key}
              description={this.getTagDescription()}
            />
          )}

          {this.state.value && (
            <DescriptionItem
              href={this.getValueLink()}
              header={this.state.value.toLowerCase()}
              description={this.getValueDescription()}
            />
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
