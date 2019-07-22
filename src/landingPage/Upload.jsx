import React from "react";
import {
  Button,
  Grid,
  Header,
  Segment,
  Label,
  Dimmer,
  Loader
} from "semantic-ui-react";
import BackButton from "./BackButton";
import ConfirmButton from "./ConfirmButton";

class Upload extends React.Component {
  constructor(props) {
    super(props);

    this.validFileScreen = this.validFileScreen.bind(this);
    this.errorScreen = this.errorScreen.bind(this);
    this.state = {
      dimmerActive: false
    };
  }

  computeNumberOfRules() {
    var nbOfRules = 0;

    if (this.props.data.configFile === undefined) return nbOfRules;

    Object.keys(this.props.ruleTypes).map(k => {
      nbOfRules += this.props.data.configFile[k].length;
      return nbOfRules;
    });

    return nbOfRules;
  }

  validFileScreen() {
    return (
      <div>
        <Header> {this.props.data.file.name} </Header>
        <Segment>
          <Label> Size: </Label> {this.props.data.file.size + " bytes"}
        </Segment>
        <Segment>
          {" "}
          <Label> Label: </Label> {this.props.data.configFile["rdfs:label"]}{" "}
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
    if (this.props.data.valid) {
      return <this.validFileScreen />;
    } else {
      return <this.errorScreen />;
    }
  }
  render() {
    return (
      <Grid centered>
        <Dimmer active={this.state.dimmerActive}>
          <Loader size="huge">Loading</Loader>
        </Dimmer>

        <Grid.Row columns={1} stretched style={{ height: "80%", padding: "0" }}>
          <Grid.Column className="contentColumn">{this.content()}</Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} stretched style={{ height: "20%", padding: "0" }}>
          <Button.Group style={{ width: "100%" }}>
            <BackButton onClick={this.props.onBack} />
            <Button.Or />
            <ConfirmButton
              onClick={() => {
                this.setState({ dimmerActive: true });
                this.props.onConfirm(this.props.data.configFile);
              }}
              disabled={!this.props.data.valid}
            />
          </Button.Group>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Upload;
