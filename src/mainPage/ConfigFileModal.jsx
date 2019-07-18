import React from "react";
import { Modal, Button } from "semantic-ui-react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import BackButton from "../landingPage/BackButton";
import ConfirmButton from "../landingPage/ConfirmButton";

export default function ConfigFileModal(props) {
  var width = "60vw";
  return (
    <Modal open={props.open} style={{ width: width }}>
      <JSONInput
        id="configFile_editor"
        placeholder={props.configFile}
        locale={locale}
        height="70vh"
        width={width}
        viewOnly={true}
      />
      <Button.Group style={{ width: width }}>
        <BackButton onClick={props.onClose} />
      </Button.Group>
    </Modal>
  );
}
