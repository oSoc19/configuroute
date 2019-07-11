import React from "react";
import ReactDOM from 'react-dom';
import { Table, Header } from 'semantic-ui-react';
import Planner from 'plannerjs';

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
mapboxgl.accessToken = 'pk.eyJ1Ijoid291dGVydmRkIiwiYSI6ImNqczRvbzRlMzA2a2UzeWx4MHlqem1lajYifQ.-kYtzbZnQhJTVeh8zDfgYg';


class Map extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
          lng: 4.5118,
          lat: 50.6282,
          zoom: 6.83
        };

        //console.log(Planner.Planner);
        this.planner = new Planner.Planner();
        this.planner.prefetchStops();
        this.planner.prefetchConnections();
        //PLANNER.JS QUERY
        this.planner.query({
          publicTransportOnly: true,
          from: "Brussel-Noord/Bruxelles-Nord",
          to: "Gent-Sint-Pieters",
          minimumDepartureTime: new Date(),
          maximumTransferDuration: Planner.Planner.Units.fromMinutes(30),
        })
            .take(5)
            .on('data', (path) => {
                console.log(path);
            })
            .on('end', () => {
                console.log('No more paths!')
            })
            .on('error', (error) => {
                console.error(error);
            });

    }

    setTooltip(features) {
        if (features.length) {
        ReactDOM.render(
            React.createElement(
            Tooltip, {
                features
            }
            ),
            this.tooltipContainer
        );
        } else {
            ReactDOM.unmountComponentAtNode(this.tooltipContainer)
        }
    }

      componentDidMount() {

        // Container to put React generated content in.
        this.tooltipContainer = document.createElement('div');
        const { lng, lat, zoom } = this.state;
    
        const map = new mapboxgl.Map({
          container: this.mapContainer,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat],
          zoom
        });

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
        });
      }

      render() {
        const { lng, lat, zoom } = this.state;
    
        return (
          <div style={{height: '100%'}}>
            <div ref={el => this.mapContainer = el} style={{height: '100%'}}/>
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
                <Table.Cell><Header as='h4'>{feature.layer['source-layer']}:</Header></Table.Cell> 
                <Table.Cell>{feature.layer.id}</Table.Cell>
            </Table.Row>
        )
      };
  
      return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='2'>Info</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body >{features.map(renderFeature)}</Table.Body>
        </Table>
      );
    }
  }

export default Map;