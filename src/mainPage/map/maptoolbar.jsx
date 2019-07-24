import React from "react";
import {
  Button,
  Container,
  Dropdown,
  Menu,
  Icon,
  Input,
  Label,
  Segment
} from "semantic-ui-react";
import MarkerButton from "./markerButton";

class MapToolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      calculating,
      from_marker,
      to_marker,
      selectable_routes,
      selected_routes,
      handleSelectedRouteAddition,
      handleSelectedRoutesChange,
      calculateRoute,
      saveCurrentRoute,
      createToMarker,
      createFromMarker,
      updateActiveRouteText,
      active_route_label_error
    } = this.props;
    return (
      <Container className="mapToolbar" style={this.props.style}>
        <Segment
          attached="bottom"
          style={{ borderRadius: 0, height: "50%", width: "270px" }}
        >
          <Dropdown
            options={selectable_routes}
            placeholder="Choose routes to display"
            search
            selection
            fluid
            multiple
            allowAdditions
            value={selected_routes}
            onAddItem={handleSelectedRouteAddition}
            onChange={handleSelectedRoutesChange}
            className="routeSelectDropdown"
          />
        </Segment>

        <Menu attached="top" style={{ borderRadius: 0, height: "50%" }}>
          <Menu.Item>
            <MarkerButton
              disabled={calculating}
              onClick={() => {
                createFromMarker();
              }}
              marker={from_marker}
              style={{ marginRight: "10px" }}
            >
              From
            </MarkerButton>
            <MarkerButton
              disabled={calculating}
              onClick={() => {
                createToMarker();
              }}
              marker={to_marker}
            >
              To
            </MarkerButton>
          </Menu.Item>
          <Menu.Item>
            <Button
              disabled={
                !(from_marker.lngLat && to_marker.lngLat) || calculating
              }
              loading={calculating}
              onClick={() => {
                calculateRoute();
              }}
            >
              <Icon name={"sync"} style={{ width: "20%" }} />
              <span className="border_right">Calculate</span>
            </Button>
          </Menu.Item>

          <Menu.Item position="right">
            <Input
              type="text"
              placeholder="name"
              onChange={evt => {
                updateActiveRouteText(evt);
              }}
              value={this.props.active_route_label_input}
              action
              disabled={
                !(from_marker.lngLat && to_marker.lngLat) || calculating
              }
            >
              <input className="prompt" />
            </Input>

            <Button
              type="submit"
              onClick={() => {
                saveCurrentRoute();
              }}
              disabled={
                !(from_marker.lngLat && to_marker.lngLat) || calculating
              }
            >
              Save route
            </Button>

            {active_route_label_error && (
              <Label basic color="red" pointing="left">
                {active_route_label_error}
              </Label>
            )}
          </Menu.Item>
        </Menu>
      </Container>
    );
  }
}

export default MapToolbar;
