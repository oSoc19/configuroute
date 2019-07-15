import React from "react";
import {
  Button,
  Grid,
  Icon,
  Header,
  Confirm,
  Segment,
  Label
} from "semantic-ui-react";
import BackButton from "./BackButton";
import ConfirmButton from "./ConfirmButton";

class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      valid: this.props.modal.state.data.valid,
      file: props.modal.state.data.file,
      configFile: props.modal.state.data.configFile
    };

    this.validFileScreen = this.validFileScreen.bind(this);
    this.errorScreen = this.errorScreen.bind(this);
  }

  computeNumberOfRules() {
    var nbOfRules = 0;

    if (this.state.configFile === undefined) return nbOfRules;
    Object.keys(this.props.modal.state.ruleTypes).map(k => {
      nbOfRules += this.state.configFile[k].length;
    });

    return nbOfRules;
  }

  validFileScreen() {
    return (
      <div>
        <Header> {this.state.file.name} </Header>
        <Segment>
          {" "}
          <Label> Label: </Label> {this.state.configFile["rdfs:label"]}{" "}
        </Segment>
        <Segment>
          {" "}
          <Label> Number of rules: </Label> {this.computeNumberOfRules()}
        </Segment>
      </div>
    );
  }

  errorScreen() {
    return (
      <Header>
        {" "}
        <Header.Content> Format unsupported </Header.Content>
      </Header>
    );
  }

  content() {
    if (this.state.valid) {
      return <this.validFileScreen />;
    } else {
      return <this.errorScreen />;
    }
  }
  render() {
    return (
      <Grid centered>
        <Grid.Row columns={1} stretched style={{ height: "80%", padding: "0" }}>
          <Grid.Column className="contentColumn">{this.content()}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} stretched style={{ height: "20%", padding: "0" }}>
          <Button.Group style={{ width: "100%" }}>
            <BackButton
              onClick={() => {
                this.props.modal.handleChangeContent("INDEX", {});
              }}
            />
            <Button.Or />
            <ConfirmButton
              onClick={() => {
                this.props.modal.handleConfirm("INDEX", {});
              }}
              disabled={!this.state.valid}
            />
          </Button.Group>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Upload;
