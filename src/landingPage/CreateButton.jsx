import React from "react";
import { Button, Icon } from "semantic-ui-react";

function CreateButton(props) {
  return (
    <Button
      icon
      labelPosition="left"
      className={"landing_page_button"}
      onClick={props.onClick}
    >
      <Icon name={"left arrow"} style={{ width: "20%" }} size="large" />
      Create new file
    </Button>
  );
}

export default CreateButton;
