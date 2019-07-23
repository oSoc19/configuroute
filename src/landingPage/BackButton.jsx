import React from "react";
import { Button, Icon } from "semantic-ui-react";

function BackButton(props) {
  return (
    <Button
      icon
      labelPosition="left"
      className={"landing_page_button"}
      onClick={props.onClick}
      style={{'padding': 0, 'margin': 0, height: '100%', 'borderRadius': '0 0 0 12px'}}
    >
      <Icon name={"left arrow"} style={{ width: "20%" }} size="large" />
      Go back
    </Button>
  );
}

export default BackButton;
