import React from "react";
const unselectable = {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    UserSelect: 'none'
}
class TooltipContent extends React.Component {
  render() {
    const { features } = this.props;
    const renderFeature = (feature, i) => {
      let id = feature.layer.id;
      if(id.startsWith("from_marker")){
        return (
        <div key={i}>
          <strong style={unselectable}>From Marker</strong>
          <hr/>
        </div>
        )
      }else if(id.startsWith("to_marker")){
        return (
        <div key={i}>
          <strong style={unselectable}>To Marker</strong>
          <hr/>
        </div>
        )
      }
      else{
        return (
          <div key={i}>
            <strong style={unselectable}>{feature.layer['source-layer']}:</strong>
          <span style={unselectable}>{feature.layer.id}</span>
          </div>
        )
      }
    };
    return (
      <div>
        <div>
          {features.map(renderFeature)}
        </div>
      </div>
    );
  }
}

export default TooltipContent;