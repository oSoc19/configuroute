import React from "react";
import { Button, Icon } from "semantic-ui-react";

function BackButton(props) {
  return (
    <Button
      icon
      labelPosition="left"
      className={"landing_page_button"}
      onClick={props.onClick}
    >
      <Icon name={"left arrow"} style={{ width: "20%" }} size="large" />
      Go back
    </Button>
  );
}

export default BackButton;
