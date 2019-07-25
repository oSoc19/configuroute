import React from "react";
import { Button, Icon } from "semantic-ui-react";

/**
 * Used troughout the interface to confirm choices made by the user
 */
function ConfirmButton(props) {
  return (
    <Button
      icon
      labelPosition="right"
      className={"landing_page_button"}
      onClick={props.onClick}
      disabled={props.disabled}
      style={{
        padding: 0,
        margin: 0,
        height: "100%",
        borderRadius: "0px 0px 12px 0px"
      }}
    >
      <Icon name={"check"} style={{ width: "20%" }} size="large" />
      {props.label ? props.label : "Confirm selection"}
    </Button>
  );
}

export default ConfirmButton;
