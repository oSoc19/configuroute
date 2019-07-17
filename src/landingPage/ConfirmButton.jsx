import React from "react";
import { Button, Icon } from "semantic-ui-react";

function ConfirmButton(props) {
  return (
    <Button
      icon
      labelPosition="right"
      className={"landing_page_button"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <Icon name={"check"} style={{ width: "20%" }} size="large" />
      Confirm selection
    </Button>
  );
}

export default ConfirmButton;
