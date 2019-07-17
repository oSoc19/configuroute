import React from "react";
import { Button, Icon } from "semantic-ui-react";

function LandingPageButton(props) {
  return (
    <Button
      icon
      labelPosition={props.labelPosition}
      className={"landing_page_button"}
      onClick={props.onClick}
    >
      <Icon name={props.iconName} style={{ width: "20%" }} size="large" />
      {props.label}
    </Button>
  );
}

export default LandingPageButton;
