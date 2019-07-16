import React from "react";
import ReactDOM from 'react-dom';
import { Label, Button, Icon, Container } from 'semantic-ui-react';
import ReactMapboxGl, { Layer, Feature, Marker } from "react-mapbox-gl";
import {Planner} from 'plannerjs';
//import MapboxGL from "@react-native-mapbox-gl/maps";

//const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
//mapboxgl.accessToken = 'pk.eyJ1Ijoid291dGVydmRkIiwiYSI6ImNqczRvbzRlMzA2a2UzeWx4MHlqem1lajYifQ.-kYtzbZnQhJTVeh8zDfgYg';
//MapboxGL.setAccessToken("pk.eyJ1Ijoid291dGVydmRkIiwiYSI6ImNqczRvbzRlMzA2a2UzeWx4MHlqem1lajYifQ.-kYtzbZnQhJTVeh8zDfgYg");

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1Ijoid291dGVydmRkIiwiYSI6ImNqczRvbzRlMzA2a2UzeWx4MHlqem1lajYifQ.-kYtzbZnQhJTVeh8zDfgYg"
});

const markerGeojson = {
  "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [0, 0]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [0, 0]
        }
      }]
};

const lineLayout = {
  'line-cap': 'round',
  'line-join': 'round'
};

const linePaint = {
  'line-color': '#B52700',
  'line-width': 8
};

const markerUrl = "assets/marker.png"


class MapPannel extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
          center: [4.5118, 50.6282],
          zoom: [6.83],
          calculating: false,
          from_marker: {
            placed: false,
            enabled: false,
            lngLat: undefined
          },
          to_marker: {
            placed: false,
            enabled: false,
            lngLat: undefined
          },
          active_route: []
        };

        this.createFromMarker = this.createFromMarker.bind(this);
        this.createToMarker = this.createToMarker.bind(this);
        this.onStyleLoad = this.onStyleLoad.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.calculateRoute = this.calculateRoute.bind(this);

        
        this.planner = new Planner();
        this.planner.setProfileID("PEDESTRIAN");
        /*this.planner.setDevelopmentProfile(//PUT CONFIG HERE);*/
          
    }

      componentDidMount() {        
        
      }


      calculateRoute(){
        this.setState({calculating: true});
        let query = {
          roadNetworkOnly: true,  // don't mix with publicTranspotOnly, for obvious reasons
          from: { latitude: this.state.from_marker.lngLat.lat, longitude: this.state.from_marker.lngLat.lng},
          to: { latitude: this.state.to_marker.lngLat.lat, longitude: this.state.to_marker.lngLat.lng}
        };
        console.log(query);
        console.log("waiting...");
        setTimeout(function(map){
          console.log("querying planner.js...");
          map.planner.query(query)
          .take(1)
          .on("error", (error) => {
            console.log(error);
          })
          .on("data", (path) => {
            console.log("got result:");
              console.log(JSON.stringify(path, null, " "));
              let coordinates = [];
              path.steps.forEach((step) => {
                coordinates.push([step.startLocation.longitude, step.startLocation.latitude]);
                coordinates.push([step.stopLocation.longitude, step.stopLocation.latitude]);
              });
              //console.log(coordinates);
              map.setState({
                active_route: coordinates
              });
          })
          .on("end", () => {
            console.log("end\n");
            map.setState({calculating: false});
          });
        }, 1000, this);

      }      

      onStyleLoad(map, evt){
        map.addSource('point', {
          "type": "geojson",
          "data": markerGeojson
          });
           
          map.addLayer({
            "id": "point",
            "type": "circle",
            "source": "point",
            "paint": {
            "circle-radius": 10,
            "circle-color": "#3887be"
            }
          });
      }

      onMouseClick(map, evt){
        if(this.state.from_marker.enabled && !this.state.from_marker.placed){
          console.log("placed from-marker at " + this.state.from_marker.lngLat);
          this.setState((state, props) => ({
            from_marker: {
              placed: true,
              enabled: true,
              lngLat: state.from_marker.lngLat
            }
          }));
          console.log(this.state.from_marker);
        }
        if(this.state.to_marker.enabled && !this.state.to_marker.placed){
          console.log("placed to-marker at " + this.state.to_marker.lngLat);
          this.setState((state, props) => ({
            to_marker: {
              placed: true,
              enabled: true,
              lngLat: state.to_marker.lngLat
            }
          }));
          console.log(this.state.to_marker);
        }
      }

      onMouseMove(map, evt){
          if(this.state.from_marker.enabled && !this.state.from_marker.placed){
            markerGeojson.features[0].geometry.coordinates = [evt.lngLat.lng, evt.lngLat.lat];
            map.getSource('point').setData(markerGeojson);

            this.setState((state, props) => ({
              from_marker: {
                placed: state.from_marker.placed,
                enabled: state.from_marker.enabled,
                lngLat: evt.lngLat
              }
            }));
          }
          else if(this.state.to_marker.enabled && !this.state.to_marker.placed){
            markerGeojson.features[1].geometry.coordinates = [evt.lngLat.lng, evt.lngLat.lat];
            map.getSource('point').setData(markerGeojson);
            this.setState((state, props) => ({
              to_marker: {
                placed: state.to_marker.placed,
                enabled: state.to_marker.enabled,
                lngLat: evt.lngLat
              }
            }));
          }
      }

      createFromMarker(){
        console.log(this.state.from_marker)
        this.setState((state, props) => ({
          from_marker: {
            placed: false,
            enabled: true,
            lngLat: state.from_marker.lngLat
          }
        }));
      }
      createToMarker(){
        console.log(this.state.to_marker.lngLat)
        this.setState((state, props) => ({
          to_marker: {
            placed: false,
            enabled: true,
            lngLat: state.to_marker.lngLat
          }
        }));
      }

      render() {
        const { center, zoom, from_marker, to_marker } = this.state;
        return (
          <div style={{height: '100%'}}>
            <Container className="fromToInputs">
              <Button disabled={this.state.calculating} as='div'
                      onClick={() => {this.createFromMarker()} } labelPosition='right'>
                <Button icon>
                <Icon name='map pin icon' />
                from
                </Button>
                <Label as='a' basic pointing='left'>{ from_marker.placed 
                && Math.round(from_marker.lngLat.lat * 10000) / 10000 + ", " 
                + Math.round(from_marker.lngLat.lng * 10000) / 10000}</Label>
              </Button>
              
              <Button disabled={this.state.calculating} as='div'
                      onClick={() => {this.createToMarker()} } labelPosition='right'>
                <Button icon>
                  <Icon name='map pin icon' />
                  to
                </Button>
                  <Label as='a' basic pointing='left'>{ to_marker.placed 
                  && Math.round(to_marker.lngLat.lat * 10000) / 10000 + ", " 
                  + Math.round(to_marker.lngLat.lng * 10000) / 10000}</Label>
              </Button>
              
              <Button disabled={!(this.state.from_marker.lngLat && this.state.to_marker.lngLat) || this.state.calculating} 
                      loading={this.state.calculating} 
                      onClick={() => {this.calculateRoute()} }>
                  Calculate route
              </Button>
            </Container>
            <div style={{height: '100%'}}>
            <Map
              style="mapbox://styles/mapbox/streets-v11"
              containerStyle={{
                height: "100%",
                width: "100%"
              }} 
              center={ center }
              zoom={ zoom }
              onStyleLoad={this.onStyleLoad}
              onMouseMove={this.onMouseMove}
              onClick={this.onMouseClick}>
                <Layer type="line" layout={lineLayout} paint={linePaint}>
                    <Feature coordinates={ this.state.active_route } />
                </Layer>
            </Map>
            </div>
          </div>
          
        );
      }
}


export default MapPannel;