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
    const { features, show_tooltip } = this.props;
    var show = false;
    const renderFeature = (feature, i) => {
      let id = feature.layer.id;
      if(id.startsWith("from_marker")){
        show = true;
        return (
        <div key={i}>
          <strong style={unselectable}>From Marker</strong>
          <hr/>
        </div>
        )
      }else if(id.startsWith("to_marker")){
        show = true;
        return (
        <div key={i}>
          <strong style={unselectable}>To Marker</strong>
          <hr/>
        </div>
        )
      }
      else if(id.startsWith("road")){
        show = true;
        return (
          <div key={i}>
            <strong style={unselectable}>{feature.layer['source-layer']}:</strong>
          <span style={unselectable}>{feature.layer.id}</span>
          </div>
        )
      }
      else{
        return;
      }
    };
    return (
      <div>
        <div>
          {features.map(renderFeature)}
        </div>
        {show_tooltip(show)}
      </div>
    );
  }
}

export default TooltipContent;