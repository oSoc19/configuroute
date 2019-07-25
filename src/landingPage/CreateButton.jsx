import React from "react";
import { Button, Icon } from "semantic-ui-react";

/**
 * Used by the landing page component to trigger the switch to the NewFileForm
 * component
 */
function CreateButton(props) {
  return (
    <Button
      icon
      labelPosition="left"
      className={"landing_page_button"}
      onClick={props.onClick}
    >
      <Icon name={"file outline"} style={{ width: "20%" }} size="large" />
      Create new file
    </Button>
  );
}

export default CreateButton;
