import React from "react";
import { Button, Grid, Icon, Image, Transition } from "semantic-ui-react";
import CreateButton from "./CreateButton";
import ImportButton from "./ImportButton";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: "welcoming",
      errorMessage: "",
      configFile: "",
      file: "",
      explanation_visible:false
    };
    this.triggerImportFile = this.triggerImportFile.bind(this);
    this.toggleTextVisibility = this.toggleTextVisibility.bind(this);
  }

  parseConfigurationFile = () => {};

  triggerImportFile(reactComponent) {
    var array = document.getElementsByClassName("import_file_button");

    var fileInput = array[0];
    var ruleTypes = this.props.ruleTypes;

    fileInput.click();
    fileInput.addEventListener("change", function(e) {
      var file = fileInput.files[0];
      var textType = /json.*/;

      if (file.type.match(textType)) {
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
              return true;
            });
          } catch (error) {
            validFile = false;
          }

          if (validFile) {
            reactComponent.props.onChangeContent("UPLOAD", {
              valid: true,
              file: file,
              configFile: JSON.parse(reader.result)
            });
          } else {
            reactComponent.props.onChangeContent("UPLOAD", {
              valid: false,
              file: null,
              configFile: null
            });
          }
        };

        reader.readAsText(file);
      } else {
        reactComponent.props.onChangeContent("UPLOAD", {
          valid: false,
          file: null,
          configFile: null
        });
      }
    });
  }

  toggleTextVisibility(){
    this.setState(prevState => ({
      explanation_visible: !prevState.explanation_visible
    }));
  }

  render() {
    const { explanation_visible } = this.state;
    return (
        <div>
            <div style={{textAlign:"center"}}>
                <Image
                  centered
                  src="assets/logo.jpg"
                  className="centerLogo"
                />
                <p className="modalTitle">
                    Your go-to for creating robust route configurations
                </p>
              <Transition.Group animation='fade down' duration={500}>
              {explanation_visible && 
              <div className="explanation modalContent">
                <p>
                  Ever traveled with unconventional means of transport such as a
                  scooter? You want to reach specific locations but your route
                  planner takes you through uncomfortable routes? We believe your
                  journey should always be adapted to your very specific mobility
                  needs. For this reason, we created ConfiguRoute: a tool to
                  quickly and easily create finely tuned configuration files for
                  your transport profiles.
                </p>
                <p>
                  Transport profiles are defined using linked open data and
                  OpenStreetMap terminologies. More information can be found at &nbsp;
                  <a className="modalContent"
                    href="http://hdelva.be/profile/ns/profile.html"
                    target="_blank"
                    rel=" noopener noreferrer"> 
                  the profile defenition ontology
                  </a>.
                </p>
              </div>
              }
            </Transition.Group>
            
            <Button content={explanation_visible ? 'show less' : 'show more'} 
                    icon={explanation_visible ? 'angle up' : 'angle down'} 
                    labelPosition='right'
                    animated='fade'
                    onClick={() => {this.toggleTextVisibility()}} />
            </div>
            <div className="horizontalContainer">
              <button className="button color_white background_green" onClick={() => {this.props.onChangeContent("NEW");}}>
                  <Icon name={"file outline"} style={{ width: "20%" }} size="large" />
                  <span>Create new file</span>
              </button>
              <span className="textUppercase">or</span>
              <button className="button color_white background_green" onClick={() => {this.triggerImportFile(this);}}>
                <Icon name={"download"} style={{ width: "20%" }} size="large" />
                <input
                  type="file"
                  className="import_file_button"
                  multiple=""
                  style={{ display: "none" }}
                  accept=".json"
                />
                <span>Import file</span>
              </button>
            </div>
        </div>
    );
  }
}

export default Index;

/*

<CreateButton className="greenButton"
              onClick={() => {
                this.props.onChangeContent("NEW");
              }}
            />
            <ImportButton className="greenButton"
              onClick={() => {
                this.triggerImportFile(this);
              }}
            />
            */