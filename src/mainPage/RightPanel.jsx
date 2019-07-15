import React from "react";
import MapPannel from "./map/map";

function RightPanel() {
  return(
  <div className="Right-panel">
    <MapPannel style={{height: '100%'}}/> 
  </div>
  );
}

export default RightPanel;
