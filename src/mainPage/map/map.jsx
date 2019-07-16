import React from "react";
import ReactDOM from "react-dom";
import {
  Table,
  Header,
  Input,
  Button,
  Icon,
  Container
} from "semantic-ui-react";
import ReactMapboxGl, { Marker } from "react-mapbox-gl";
//import Planner from 'plannerjs';
//import MapboxGL from "@react-native-mapbox-gl/maps";

//const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
//mapboxgl.accessToken = 'pk.eyJ1Ijoid291dGVydmRkIiwiYSI6ImNqczRvbzRlMzA2a2UzeWx4MHlqem1lajYifQ.-kYtzbZnQhJTVeh8zDfgYg';
//MapboxGL.setAccessToken("pk.eyJ1Ijoid291dGVydmRkIiwiYSI6ImNqczRvbzRlMzA2a2UzeWx4MHlqem1lajYifQ.-kYtzbZnQhJTVeh8zDfgYg");

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1Ijoid291dGVydmRkIiwiYSI6ImNqczRvbzRlMzA2a2UzeWx4MHlqem1lajYifQ.-kYtzbZnQhJTVeh8zDfgYg"
});

class MapPannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: [4.5118, 50.6282],
      zoom: [6.83],
      from_marker: {
        placed: false,
        enabled: false,
        lngLat: undefined
      },
      to_marker: {
        placed: false,
        enabled: false,
        lngLat: undefined
      }
    };

    this.createFromMarker = this.createFromMarker.bind(this);
    this.createToMarker = this.createToMarker.bind(this);
    this.onStyleLoad = this.onStyleLoad.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    /*
        this.planner = new Planner.RoadPlannerPathfinding();
        //PLANNER.JS QUERY
        this.planner.query({
          publicTransportOnly: true,
          from: { latitude: 50.860812, longitude: 4.356574},
          to: { latitude: 50.860832, longitude: 4.356594}
        })
            .take(1)
            .on('data', (path) => {
                console.log(path);
            })
            .on('end', () => {
                console.log('No more paths!')
            })
            .on('error', (error) => {
                console.error(error);
            });*/
  }

  setTooltip(features) {
    if (features.length) {
      ReactDOM.render(
        React.createElement(Tooltip, {
          features
        }),
        this.tooltipContainer
      );
    } else {
      ReactDOM.unmountComponentAtNode(this.tooltipContainer);
    }
  }

  componentDidMount() {
    // Container to put React generated content in.
    this.tooltipContainer = document.createElement("div");

    /*
        const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
            offset: [-120, 0]
          }).setLngLat([0,0]).addTo(map);
          
          map.on('mousemove', (e) => {
            const features = map.queryRenderedFeatures(e.point);
            tooltip.setLngLat(e.lngLat);
            map.getCanvas().style.cursor = features.length ? 'pointer' : '';
            this.setTooltip(features);
          });
            
         map.on('move', () => {
          const { lng, lat } = map.getCenter();
    
          this.setState({
            lng: lng.toFixed(4),
            lat: lat.toFixed(4),
            zoom: map.getZoom().toFixed(2)
          });
        });*/
  }

  onStyleLoad() {}

  onMouseMove(map, evt) {
    if (this.state.to_marker.enabled && !this.state.to_marker.placed) {
      this.setState({
        to_marker: {
          latLng: evt.lngLat
        }
      });
    }
    if (this.state.from_marker.enabled && !this.state.from_marker.placed) {
      this.setState({
        from_marker: {
          placed: false,
          enabled: true,
          lngLat: evt.lngLat
        }
      });
    }
  }

  createFromMarker() {
    this.setState({
      from_marker: {
        placed: false,
        enabled: true,
        lngLat: [4.5118, 50.6282]
      }
    });
  }
  createToMarker() {
    this.setState({ to_marker: { enabled: true } });
  }

  render() {
    const { center, zoom, from_marker, to_marker } = this.state;
    return (
      <div style={{ height: "100%" }}>
        <Container className="fromToInputs">
          <Button
            icon
            onClick={() => {
              this.createFromMarker();
            }}
          >
            <Icon name="map pin" />
          </Button>
          <Input />
          <Button
            icon
            onClick={() => {
              this.createFromMarker();
            }}
          >
            <Icon name="map pin" />
          </Button>
          <Input />
        </Container>
        <div style={{ height: "100%" }}>
          <Map
            style={"mapbox://styles/mapbox/streets-v11"}
            containerStyle={{
              height: "100%",
              width: "100%"
            }}
            center={center}
            zoom={zoom}
            onStyleLoad={this.onStyleLoad}
            onMouseMove={this.onMouseMove}
          >
            {from_marker.enabled && (
              <Marker coordinates={from_marker.lngLat} anchor="bottom">
                <img
                  src="./assets/marker.png"
                  style={{ width: "40px", height: "40px" }}
                  alt="marker"
                />
              </Marker>
            )}
            {to_marker.enabled && !isNaN(to_marker.lngLat) && (
              <Marker coordinates={to_marker.latLng} anchor="bottom">
                <img
                  alt="marker"
                  src="./assets/marker.png"
                  style={{ width: "40px", height: "40px" }}
                />
              </Marker>
            )}
          </Map>
        </div>
      </div>
    );
  }
}

class Tooltip extends React.Component {
  render() {
    const { features } = this.props;

    const renderFeature = (feature, i) => {
      return (
        <Table.Row key={i}>
          <Table.Cell>
            <Header as="h4">{feature.layer["source-layer"]}:</Header>
          </Table.Cell>
          <Table.Cell>{feature.layer.id}</Table.Cell>
        </Table.Row>
      );
    };

    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">Info</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{features.map(renderFeature)}</Table.Body>
      </Table>
    );
  }
}

export default MapPannel;
