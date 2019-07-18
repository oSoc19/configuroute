import React from "react";
import { Label, Menu, Button, Icon, Search } from "semantic-ui-react";

class HomeTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Button>Add new rule</Button>
        <p> Display rules </p>
      </div>
    );
  }
}

export default HomeTab;
