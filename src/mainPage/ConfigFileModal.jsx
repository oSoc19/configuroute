import React from "react";
import { Modal, Button } from "semantic-ui-react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import BackButton from "../landingPage/BackButton";

/**
 *
 * This component displays the current configuration file into a nice JSON editor
 *
 */
export default function ConfigFileModal(props) {
  var width = "60vw";
  return (
    <Modal open={props.open} style={{ width: width, height: "70vh" }}>
      <JSONInput
        id="configFile_editor"
        placeholder={props.configFile}
        locale={locale}
        height="100%"
        width={width}
        viewOnly={
          true
        } /*we do not (yet) allow users to modify the configuration
        file directly trough the editor. Feel free to make a pull request for
        this feature, by providing a function which would check if the edited 
        configuration file follows the profile ontology.*/
      />
      <Button.Group style={{ width: width, height: "8%" }}>
        <BackButton onClick={props.onClose} />
      </Button.Group>
    </Modal>
  );
}
