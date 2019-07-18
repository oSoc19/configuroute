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
      style={{'padding': 0, 'margin': 0, 'border-radius': '0px 0px 12px 0px'}}
    >
      <Icon name={"check"} style={{ width: "20%" }} size="large" />
      Confirm selection
    </Button>
  );
}

export default ConfirmButton;
