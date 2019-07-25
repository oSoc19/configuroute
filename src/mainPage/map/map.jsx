import { Planner } from "plannerjs";
import React from "react";
import ReactMapboxGl, { Feature, Layer, Popup } from "react-mapbox-gl";
import { Loader, Dimmer, Segment } from "semantic-ui-react";
import MapToolbar from "./maptoolbar";
import TooltipContent from "./tooltipContent";
import { isAbsolute } from "path";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoiZ3VndWwiLCJhIjoiY2p4cDVqZXZvMGN6ejNjcm5zdjF6OWR1dSJ9._vc_H7CbewiDCHWYvD4CdQ"
});

//geojson templates used to define the locations of the markers on the map
const markerFromGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      }
    }
  ]
};
const markerToGeojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0]
      }
    }
  ]
};

//active route looks
const lineLayout = {
  "line-cap": "round",
  "line-join": "round"
};
const linePaint = {
  "line-color": "#28A987",
  "line-width": 8
};

//saved route looks
const savedRouteLinePaint = {
  "line-color": "#0B3463",
  "line-width": 5
};
const containerStyle = {
  height: "100%",
  width: "100%",
  cursor: ""
};


class MapPannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: [4.5118, 50.6282],
      zoom: [6.83],
      calculating: false,
      map_features: undefined,
      show_tooltip: true,
      cursor_location: [4.5118, 50.6282],
      from_marker: {
        placed: false,
        enabled: true,
        visible: false,
        dragging: false,
        lngLat: undefined
      },
      to_marker: {
        placed: false,
        enabled: false,
        dragging: false,
        visible: false,
        lngLat: undefined
      },
      active_route: {
        key: undefined,
        text: undefined,
        coordinates: []
      },
      saved_routes: [],
      selectable_routes: [],
      selected_routes: [],
      container_style: containerStyle,
      active_route_label_input: "",
      active_route_label_error: undefined
    };

    this.createFromMarker = this.createFromMarker.bind(this);
    this.createToMarker = this.createToMarker.bind(this);
    this.onStyleLoad = this.onStyleLoad.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseClick = this.onMouseClick.bind(this);
    this.calculateRoute = this.calculateRoute.bind(this);
    this.handleSelectedRoutesChange = this.handleSelectedRoutesChange.bind(this);
    this.handleSelectedRouteAddition = this.handleSelectedRouteAddition.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.saveCurrentRoute = this.saveCurrentRoute.bind(this);
    this.updateActiveRouteText = this.updateActiveRouteText.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);

    //initialize planner.js
    this.planner = new Planner();
    this.planner.setProfileID("PEDESTRIAN");
  }

  //insert the updated config file into planner.js
  componentDidUpdate(pervProps) {
    if (pervProps.configFile !== this.props.configFile) {
      this.planner.setDevelopmentProfile(this.props.configFile);
    }
  }

  calculateRoute() {
    //check if start and end locations are known
    if (
      this.state.from_marker.placed &&
      this.state.to_marker.placed &&
      !this.state.calculating
    ) {
      //let the ui know that a route is buing calculated
      this.setState({ calculating: true });
      let query = {
        roadNetworkOnly: true, // don't mix with publicTransportOnly, for obvious reasons
        from: {
          latitude: this.state.from_marker.lngLat.lat,
          longitude: this.state.from_marker.lngLat.lng
        },
        to: {
          latitude: this.state.to_marker.lngLat.lat,
          longitude: this.state.to_marker.lngLat.lng
        }
      };
      this.planner
        .query(query)
        .take(1)
        .on("error", error => {
          //TODO: planner.js sometimes stops working completly, 
          //only refresh seems to fix it
          console.log("planner.js gave an error:");
          console.log(error);
          this.setState({ calculating: false });
        })
        .on("data", path => {
          //save coordinates to be drawn in list
          let route_coordinates = [];
          path.steps.forEach(step => {
            route_coordinates.push([
              step.startLocation.longitude,
              step.startLocation.latitude
            ]);
            route_coordinates.push([
              step.stopLocation.longitude,
              step.stopLocation.latitude
            ]);
          });
          //date used as temp name
          let date = new Date();
          this.setState(prevState => ({
            active_route: {
              key: prevState.saved_routes.length,
              text: date.toISOString(),
              coordinates: route_coordinates
            }
          }));
        })
        .on("end", () => {
          console.log("end\n");
          this.setState({ calculating: false });
        });
    }
  }

  
  saveCurrentRoute() {
    //set the label for the current route
    this.setState(prevState => ({
      active_route: {
        key: prevState.active_route.key,
        text: prevState.active_route_label_input,
        coordinates: prevState.active_route.coordinates
      }
    }));
    //check if the route being saved is not already saved (same id or name)
    let key = this.state.active_route.key;
    let text = this.state.active_route_label_input;
    let routeExists = false;
    this.state.saved_routes.forEach(route => {
      if (route.key === key) {
        this.setState({
          active_route_label_error: "route already saved!"
        });
        routeExists = true;
        return;
      }
      if (route.text.localeCompare(text) === 0) {
        this.setState({
          active_route_label_error: "already used that name!"
        });
        routeExists = true;
        return;
      }
    });
    if (!routeExists) {
      //add the route to the saved routes and clear the textfield
      this.setState(prevState => ({
        saved_routes: [prevState.active_route, ...prevState.saved_routes],
        selectable_routes: [
          {
            key: prevState.active_route.key,
            text: prevState.active_route.text,
            value: prevState.active_route.key
          },
          ...prevState.selectable_routes
        ],
        active_route_label_input: ""
      }));
    }
  }

  //keeps the state in sinc with the value of the textfield
  //and clears the error message when you change the text
  updateActiveRouteText(evt) {
    this.setState({
      active_route_label_input: evt.target.value,
      active_route_label_error: undefined
    });
  }


  onMouseUp(map, evt) {
    var coords = evt.lngLat;
    //stop dragging the markers and recalculate the route
    if (this.state.from_marker.dragging) {
      this.setState(prevState => ({
        from_marker: {
          placed: prevState.from_marker.placed,
          enabled: prevState.from_marker.enabled,
          visible: prevState.from_marker.visible,
          dragging: false,
          lngLat: coords
        }
      }));
      this.calculateRoute();
    } else if (this.state.to_marker.dragging) {
      this.setState(prevState => ({
        to_marker: {
          placed: prevState.to_marker.placed,
          enabled: prevState.to_marker.enabled,
          visible: prevState.to_marker.visible,
          dragging: false,
          lngLat: coords
        }
      }));
      this.calculateRoute();
    }
  }

  //gets called when the mat is done loading, ideal place to access
  //the mapbox gl api directly (not everything can be done trough the react wrapper)
  onStyleLoad(map, e) {
    //add the markers
    map.addSource("from_marker", {
      type: "geojson",
      data: markerFromGeojson
    });
    map.addSource("to_marker", {
      type: "geojson",
      data: markerToGeojson
    });
    map.addLayer({
      id: "from_marker",
      type: "circle",
      source: "from_marker",
      paint: {
        "circle-radius": 10,
        "circle-color": "#3887be"
      }
    });
    map.addLayer({
      id: "to_marker",
      type: "circle",
      source: "to_marker",
      paint: {
        "circle-radius": 10,
        "circle-color": "#6b7cff"
      }
    });

    let parent = this;
    // When the cursor enters a feature in the point layer, prepare for dragging.
    map.on("mouseenter", "from_marker", function() {
      map.setPaintProperty("from_marker", "circle-color", "#3bb2d0");
      containerStyle.cursor = "move";
      parent.setState({ container_style: containerStyle });
    });

    map.on("mouseleave", "from_marker", function() {
      map.setPaintProperty("from_marker", "circle-color", "#3887be");
      containerStyle.cursor = "";
      parent.setState({ container_style: containerStyle });
    });

    map.on("mousedown", "from_marker", function(e) {
      if (parent.state.from_marker.placed) {
        // Prevent the default map drag behavior.
        e.preventDefault();
      }
      //enable dragging
      parent.setState(prevState => ({
        from_marker: {
          placed: prevState.from_marker.placed,
          enabled: prevState.from_marker.enabled,
          visible: prevState.from_marker.visible,
          dragging: true,
          lngLat: prevState.from_marker.lngLat
        }
      }));
      containerStyle.cursor = "grab";
      parent.setState({ container_style: containerStyle });
    });

    //do the same for the to marker
    map.on("mouseenter", "to_marker", function() {
      map.setPaintProperty("to_marker", "circle-color", "#3bb2d0");
      containerStyle.cursor = "move";
      parent.setState({ container_style: containerStyle });
    });
    map.on("mouseleave", "to_marker", function() {
      map.setPaintProperty("to_marker", "circle-color", "#9f7feb");
      containerStyle.cursor = "";
      parent.setState({ container_style: containerStyle });
    });
    map.on("mousedown", "to_marker", function(e) {
      if (parent.state.to_marker.placed) {
        // Prevent the default map drag behavior.
        e.preventDefault();
      }
      parent.setState(prevState => ({
        to_marker: {
          placed: prevState.to_marker.placed,
          enabled: prevState.to_marker.enabled,
          visible: prevState.to_marker.visible,
          dragging: true,
          lngLat: prevState.to_marker.lngLat
        }
      }));
      containerStyle.cursor = "grab";
      parent.setState({ container_style: containerStyle });
    });
  }

  onMouseClick(map, evt) {
    var coords = evt.lngLat;
    //if the from marker is enabled but not placed, plop it down here
    if (
      this.state.from_marker.enabled &&
      !this.state.from_marker.placed &&
      !this.state.from_marker.dragging
    ) {
      console.log("placed from-marker at " + this.state.from_marker.lngLat);
      this.setState(prevState => ({
        from_marker: {
          placed: true,
          enabled: true,
          visible: true,
          dragging: false,
          lngLat: coords
        }
      }));
      //if the to marker was not enabled yet, enable it so the user
      //can place it without having to click the to button
      if (!this.state.to_marker.enabled) {
        this.setState({
          to_marker: {
            placed: false,
            enabled: true,
            visible: true,
            dragging: false,
            lngLat: coords
          }
        });
      }
    //if the to marker is enabled but not placed, plop it down here
    } else if (
      this.state.to_marker.enabled &&
      !this.state.to_marker.placed &&
      !this.state.to_marker.dragging
    ) {
      console.log("placed to-marker at " + this.state.to_marker.lngLat);
      this.setState(prevState => ({
        to_marker: {
          placed: true,
          enabled: true,
          visible: true,
          dragging: false,
          lngLat: coords
        }
      }));
    }
    //check if the active route still corresponds with the markers,
    //if not, recalculate
    if (
      this.state.from_marker.enabled &&
      this.state.to_marker.enabled &&
      (JSON.stringify([
        this.state.from_marker.lngLat.lng,
        this.state.from_marker.lngLat.lat
      ]) !== JSON.stringify(this.state.active_route.coordinates[0]) ||
        JSON.stringify([
          this.state.to_marker.lngLat.lng,
          this.state.to_marker.lngLat.lat
        ]) !==
          JSON.stringify(
            this.state.active_route.coordinates[
              this.state.active_route.coordinates.length - 1
            ]
          ))
    ) {
      this.calculateRoute();
    }
  }

  //gets called every mouse move
  updateTooltip(map, evt) {
    //only show if not interacting with markers
    if (
      !(this.state.from_marker.dragging || this.state.to_marker.dragging) &&
      (this.state.from_marker.placed || !this.state.from_marker.enabled) &&
      (this.state.to_marker.placed || !this.state.to_marker.enabled)
    ) {
      let features = map.queryRenderedFeatures(evt.point);
      //filter out useless information
      let i = 0;
      let filtered_features = [];
      for(i = 0; i<features.length; i++){
        let id = features[i].layer.id;
        if((id.startsWith("from_marker")
          || id.startsWith("to_marker")
          || id.startsWith("road"))){
            filtered_features.push(features[i]);
          }
      }
      if(features.length > 0){
        this.setState({ cursor_location: evt.lngLat, map_features: filtered_features });
        map.getCanvas().style.cursor = "pointer";
      }
    } else {
      map.getCanvas().style.cursor =  "";
      this.setState({ cursor_location: evt.lngLat, map_features: undefined });
    }
  }

  onMouseLeave(map, evt) {
    //make things following the cursor invisible when the cursor is
    //ot over the map 
    this.setState({ show_tooltip: false });
    if (!this.state.from_marker.placed) {
      map.setLayoutProperty("from_marker", "visibility", "none");
    }
    if (!this.state.to_marker.placed) {
      map.setLayoutProperty("to_marker", "visibility", "none");
    }
  }

  onMouseMove(map, evt) {
    if (!this.state.show_tooltip) {
      //the cursor is over the map again, make things visible again
      this.setState({
        show_tooltip: true
      });
      map.setLayoutProperty("to_marker", "visibility", "visible");
      map.setLayoutProperty("from_marker", "visibility", "visible");
    }
    this.updateTooltip(map, evt);

    //update the positions of the markers to follow the mouse
    if (
      this.state.from_marker.enabled &&
      !this.state.from_marker.placed &&
      !this.state.from_marker.dragging
    ) {
      markerFromGeojson.features[0].geometry.coordinates = [
        evt.lngLat.lng,
        evt.lngLat.lat
      ];
      map.getSource("from_marker").setData(markerFromGeojson);
    } else if (
      this.state.to_marker.enabled &&
      !this.state.to_marker.placed &&
      !this.state.to_marker.dragging
    ) {
      markerToGeojson.features[0].geometry.coordinates = [
        evt.lngLat.lng,
        evt.lngLat.lat
      ];
      map.getSource("to_marker").setData(markerToGeojson);
    }
    if (this.state.from_marker.dragging) {
      markerFromGeojson.features[0].geometry.coordinates = [
        evt.lngLat.lng,
        evt.lngLat.lat
      ];
      map.getSource("from_marker").setData(markerFromGeojson);
    } else if (this.state.to_marker.dragging) {
      markerToGeojson.features[0].geometry.coordinates = [
        evt.lngLat.lng,
        evt.lngLat.lat
      ];
      map.getSource("to_marker").setData(markerToGeojson);
    }
  }

  //markers are already created (at pos 0,0), this just updates the state
  //so they follow the cursor
  //also disable the to marker again so it's easier to place afterwards
  //(witch also avoids unwillingly calculating very long routes)
  createFromMarker() {
    console.log(this.state.from_marker);
    this.setState(prevState => ({
      from_marker: {
        placed: false,
        enabled: true,
        visible: prevState.from_marker.visible,
        dragging: prevState.from_marker.dragging,
        lngLat: prevState.from_marker.lngLat
      },
      to_marker: {
        placed: false,
        enabled: false,
        visible: false,
        dragging: false,
        lngLat: [0, 0]
      }
    }));
  }

  createToMarker() {
    console.log(this.state.to_marker.lngLat);
    this.setState(prevState => ({
      to_marker: {
        placed: false,
        enabled: true,
        visible: prevState.to_marker.visible,
        dragging: prevState.to_marker.dragging,
        lngLat: prevState.to_marker.lngLat
      }
    }));
  }

  //handler for the selected routes dropdown (adding is not enaabled though)
  handleSelectedRouteAddition = (e, { value }) => {
    console.log("hadleAddition value");
    console.log(value);
    this.setState(prevState => ({
      selectable_routes: [
        ...prevState.selectable_routes,
        { key: value, text: value, value }
      ]
    }));
  };

  //handler for the selected routes dropdown
  handleSelectedRoutesChange = (e, { value }) => {
    console.log("hadleChange value");
    console.log(value);
    console.log(this.state.saved_routes);
    this.setState({ selected_routes: value });
  };


  render() {
    const { center, zoom } = this.state;
    
    //saved routes selected to be drawn
    const routesToDraw = this.state.selected_routes.map(k => {
      let size = this.state.saved_routes.length;
      let i = 0;
      while (this.state.saved_routes[i].key != k && i < size) {
        i++;
      }
      return (
        <Layer
          key={this.state.saved_routes[i].key}
          type="line"
          layout={lineLayout}
          paint={savedRouteLinePaint}
        >
          <Feature coordinates={this.state.saved_routes[i].coordinates} />
        </Layer>
      );
    });
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <MapToolbar
          style={{ height: "117px", width: "100%" }}
          calculating={this.state.calculating}
          from_marker={this.state.from_marker}
          to_marker={this.state.to_marker}
          createFromMarker={this.createFromMarker}
          createToMarker={this.createToMarker}
          selectable_routes={this.state.selectable_routes}
          selected_routes={this.state.selected_routes}
          handleSelectedRouteAddition={this.handleSelectedRouteAddition}
          handleSelectedRoutesChange={this.handleSelectedRoutesChange}
          calculateRoute={this.calculateRoute}
          saveCurrentRoute={this.saveCurrentRoute}
          active_route_label_input={this.state.active_route_label_input}
          updateActiveRouteText={this.updateActiveRouteText}
          active_route_label_error={this.state.active_route_label_error}
        />
        <Segment
          style={{
            position: "absolute",
            top: "117px",
            bottom: 0,
            width: "67vw",
            borderRadius: 0,
            padding: 0,
            margin: 0,
            border: "none",
            overflowY: "Hidden"
          }}
        >
          <Dimmer active={this.state.calculating} inverted>
            <Loader>Calculating Route</Loader>
          </Dimmer>
          <Map
            style="mapbox://styles/gugul/cjy77yl1713rg1cn0wiwq2ong/draft"
            containerStyle={this.state.container_style}
            center={center}
            zoom={zoom}
            onStyleLoad={this.onStyleLoad}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseUp}
            onClick={this.onMouseClick}
            onMouseOut={this.onMouseLeave}
          >
            <Layer type="line" layout={lineLayout} paint={linePaint}>
              <Feature coordinates={this.state.active_route.coordinates} />
            </Layer>
            {routesToDraw}
            {this.state.show_tooltip &&
              this.state.map_features &&
              this.state.map_features.length && (
                <Popup
                  coordinates={this.state.cursor_location}
                  offset={{
                    "bottom-left": [12, -10],
                    bottom: [0, -10],
                    "bottom-right": [-12, -10]
                  }}
                >
                  <TooltipContent features={this.state.map_features} />
                </Popup>
              )}
          </Map>
        </Segment>
      </div>
    );
  }
}

export default MapPannel;
