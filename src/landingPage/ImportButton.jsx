import React from "react";
import { Button, Icon } from "semantic-ui-react";

function ImportButton(props) {
  return (
    <Button icon labelPosition="right" onClick={props.onClick}>
      <Icon name={"download"} style={{ width: "20%" }} size="large" />
      <input
        type="file"
        className="import_file_button"
        multiple=""
        style={{ display: "none" }}
        accept=".json"
      />
      Import file
    </Button>
  );
}

export default ImportButton;
