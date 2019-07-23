import React from "react";
import {
  Button,
  Grid,
  Icon,
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
        <h2 className="color_white"> {this.props.data.file.name} </h2>
        <Segment>
          <Label> Size: </Label> {this.props.data.file.size + " bytes"}
        </Segment>
        <Segment>
          <Label> Label: </Label> {this.props.data.configFile["rdfs:label"]}{" "}
        </Segment>
        <Segment>
          <Label> Number of rules: </Label> {this.computeNumberOfRules()}
        </Segment>
      </div>
    );
  }

  errorScreen() {
    return (
        <h2 className="color_white"> Format unsupported </h2>
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
      <div>
        <Dimmer active={this.state.dimmerActive}>
          <Loader size="huge">Loading</Loader>
        </Dimmer>
          {this.content()}
          <div className="horizontalContainer">
          <button className="button_secondary color_dark_blue background_white" onClick={this.props.onBack}>
              <Icon name={"arrow left"} />
              <span>Go back</span>                  
          </button>
          <button className="button color_white background_green" 
            onClick={() => {
              this.setState({ dimmerActive: true });
              this.props.onConfirm(this.props.data.configFile);
            }}>
            <Icon name={"checkmark"} style={{ width: "20%" }} size="large" />
            <span>Confirm selection</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Upload;
