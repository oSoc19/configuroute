import React from "react";
import { Button, Grid, Icon, Image, Transition } from "semantic-ui-react";

/**
 * This component is the welcoming screen displayed on the landing page
 * when the website is loaded. It displays the purpose of the tool and invite
 * the user to choose between creating a new configuration file or starting
 * from an existing one.
 */
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      explanation_visible: false
    };
    this.triggerImportFile = this.triggerImportFile.bind(this);
    this.toggleTextVisibility = this.toggleTextVisibility.bind(this);
  }

  /**
   *
   * This functions triggers the importation of a file from the user's computer.
   *
   * @param {*} reactComponent the current Index component. Inside CallBacks
   * for event listeners, the keyword "this" does not refer to the current React
   * component, it is the reason why we pass it as an argument.
   *
   */
  triggerImportFile(reactComponent) {
    var array = document.getElementsByClassName("import_file_button");

    var fileInput = array[0];
    var typesOfRuleMetadata = this.props.typesOfRuleMetadata;

    /* because the input tag does not match our styling, we hid it 
    and we manually trigger the click event when the user clicks on a specific
    button which is styled to our preferences */

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

            /* we test wheter or not the JSON object actually correspond 
            to a configuration file. Notice that the check is shallow and should
            be improved to perform a deep checking. */

            Object.keys(typesOfRuleMetadata).map(k => {
              if (configFile[k] == null || !Array.isArray(configFile[k]))
                validFile = false;
              return true;
            });
          } catch (error) {
            validFile = false;
          }

          /* we return to the Landing page metadata and data of the file that
          is imported, so that it can be passed to the Upload component*/

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

  toggleTextVisibility() {
    this.setState(prevState => ({
      explanation_visible: !prevState.explanation_visible
    }));
  }

  render() {
    const { explanation_visible } = this.state;
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <Image centered src="assets/logo.jpg" className="centerLogo" />
          <p className="modalTitle">
            Your go-to for creating robust route configurations
          </p>
          <Transition.Group animation="fade down" duration={500}>
            {explanation_visible && (
              <div className="explanation modalContent">
                <p>
                  Ever traveled with unconventional means of transport such as a
                  scooter? You want to reach specific locations but your route
                  planner takes you through uncomfortable routes? We believe
                  your journey should always be adapted to your very specific
                  mobility needs. For this reason, we created ConfiguRoute: a
                  tool to quickly and easily create finely tuned configuration
                  files for your transport profiles.
                </p>
                <p>
                  Transport profiles are defined using linked open data and
                  OpenStreetMap terminologies. More information can be found at
                  &nbsp;
                  <a
                    className="modalContent"
                    href="http://hdelva.be/profile/ns/profile.html"
                    target="_blank"
                    rel=" noopener noreferrer"
                  >
                    the profile defenition ontology
                  </a>
                  .
                </p>
              </div>
            )}
          </Transition.Group>

          <a
            className="color_white "
            onClick={() => {
              this.toggleTextVisibility();
            }}
          >
            {explanation_visible ? "Read less" : "Read more"}
            <Icon
              name={explanation_visible ? "angle up" : "angle down"}
              size="large"
            />
          </a>
        </div>
        <div className="horizontalContainer">
          <button
            className="button color_white background_green"
            onClick={() => {
              this.props.onChangeContent("NEW");
            }}
          >
            <Icon name={"plus"} style={{ width: "20%" }} />
            <span className="border_right">Create new</span>
          </button>
          <span className="textUppercase color_white buttonDevider">or</span>
          <button
            className="button color_white background_green"
            onClick={() => {
              this.triggerImportFile(this);
            }}
          >
            <Icon name={"download"} style={{ width: "20%" }} />
            <input
              type="file"
              className="import_file_button"
              multiple=""
              style={{ display: "none" }}
              accept=".json"
            />
            <span className="border_right" style={{ paddingTop: "3px" }}>
              Import file
            </span>
          </button>
        </div>
      </div>
    );
  }
}

export default Index;
