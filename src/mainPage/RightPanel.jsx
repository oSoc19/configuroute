import React from "react";
import MapPannel from "./map/map";

function RightPanel(props) {
  return (
  <div className="Right-panel">
    <MapPannel configFile={props.configFile} style={{height: '100%', width: '100%' }}/>
  </div>
  );
}

export default RightPanel;
