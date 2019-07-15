import React from "react";
import {
  Button,
  Grid,
  Icon,
  Header,
  Image,
  Label,
  Segment
} from "semantic-ui-react";
import CreateButton from "./CreateButton";
import ImportButton from "./ImportButton";

const ruleTypes = {
  hasAccessRules: {
    conclusion: "hasAccess",
    defaultValue: false
  },
  hasObstacleRules: {
    conclusion: "isObstacle",
    defaultValue: true
  },
  hasOnewayRules: {
    conclusion: "isOneway",
    defaultValue: true
  },
  hasPriorityRules: {
    conclusion: "isReversed",
    defaultValue: 0
  },
  hasSpeedRules: {
    conclusion: "hasSpeed",
    defaultValue: 35
  }
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "welcoming",
      errorMessage: "",
      configFile: "",
      file: ""
    };
    this.triggerImportFile = this.triggerImportFile.bind(this);
  }

  parseConfigurationFile = () => {};

  triggerImportFile(reactComponent) {
    var array = document.getElementsByClassName("import_file_button");
    console.log("triggered");

    var fileInput = array[0];

    fileInput.click();
    fileInput.addEventListener("change", function(e) {
      var file = fileInput.files[0];
      var textType = /json.*/;

      if (file.type.match(textType)) {
        console.log("good extension");
        var reader = new FileReader();

        reader.onload = function(e) {
          var configFile;
          var validFile = true;

          try {
            configFile = JSON.parse(reader.result);
            if (configFile["@context"] == null) {
              validFile = false;
            }

            Object.keys(ruleTypes).map(k => {
              if (configFile[k] == null || !Array.isArray(configFile[k]))
                validFile = false;
            });
          } catch (error) {
            validFile = false;
          }

          if (validFile) {
            reactComponent.props.modal.handleChangeContent("UPLOAD", {
              valid: true,
              file: file,
              configFile: JSON.parse(reader.result)
            });
          } else {
            reactComponent.props.modal.handleChangeContent("UPLOAD", {
              valid: false,
              file: null,
              configFile: null
            });
          }
        };

        reader.readAsText(file);
      } else {
        reactComponent.props.modal.handleChangeContent("UPLOAD", {
          valid: false,
          file: null,
          configFile: null
        });
      }
    });
  }

  render() {
    return (
      <Grid centered>
        <Grid.Row columns={1} stretched style={{ height: "80%", padding: "0" }}>
          <Grid.Column className="contentColumn">
            <div>
              <Header as="h2" icon textAlign="center">
                <Image
                  centered
                  rounded
                  src="assets/logo.jpg"
                  className="centerLogo"
                />
                <Header.Content>
                  Your go-to for creating robust route configurations
                </Header.Content>
              </Header>
              <Header as="h3" dividing textAlign="center">
                Purpose
              </Header>
              <p>
                Ever traveled with unconventional means of transport such as a
                scooter ? You want to reach specific locations but your route
                planner takes you through uncomfortable routes? We believe your
                journey should always be adapted to your very specific mobility
                needs. For this reason, we created *ConfiguRoute* : a tool to
                quickly and easily create finely tuned configuration files for
                your transport profiles. These configs can then be used to
                design existing or new route planners.
              </p>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} stretched style={{ height: "20%", padding: "0" }}>
          <Button.Group style={{ width: "100%" }}>
            <CreateButton
              onClick={() => {
                this.props.modal.handleChangeContent("NEW", {});
              }}
            />
            <Button.Or />
            <ImportButton
              onClick={() => {
                this.triggerImportFile(this);
              }}
            />
          </Button.Group>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Index;
