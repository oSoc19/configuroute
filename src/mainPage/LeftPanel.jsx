import React from "react";
import HomeTab from "./HomeTab";
import SourceTab from "./SourceTab";

class LeftPanel extends React.Component {
  constructor(props) {
    super(props);
    this.handleHomeClick = this.handleHomeClick.bind(this);
    this.handleSourceClick = this.handleSourceClick.bind(this);
    this.state = { tab: "Home" };
  }

  handleHomeClick() {
    this.setState({ tab: "Home" });
  }

  handleSourceClick() {
    this.setState({ tab: "Source" });
  }

  render() {
    const tabType = this.state.tab;
    let tab;

    if (tabType === "Home") {
      tab = <HomeTab />;
    } else {
      tab = <SourceTab />;
    }

    return (
      <div className="Left-panel">
        <div className="Tab-bar">
          <button
            className="Tab-selector"
            type="button"
            onClick={this.handleHomeClick}
          >
            {" "}
            Home{" "}
          </button>
          <button
            className="Tab-selector"
            type="button"
            onClick={this.handleSourceClick}
          >
            {" "}
            Souce
          </button>
          <button type="button"> Save </button>
          <button type="button"> Try it </button>
        </div>
        {tab}
      </div>
    );
  }
}

export default LeftPanel;
