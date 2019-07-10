import React from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

function MainContent() {
  return (
    <div className="App-content">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}

export default MainContent;
