import React from "react";
import { Button, Container, Dropdown, Icon, Input, Label } from 'semantic-ui-react';
import MarkerButton from './markerButton';

class MapToolbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            active_route_label_input: undefined,
        }
    }

    updateActiveRouteText(evt) {
        this.setState({
          active_route_label_input: evt.target.value,
        });
      }

    render(){
        const { calculating, from_marker, to_marker, selectable_routes, selected_routes, 
                handleSelectedRouteAddition, handleSelectedRoutesChange, calculateRoute,
                saveCurrentRoute, createToMarker, createFromMarker } = this.props;
        return(
            <Container className="mapToolbar">
                
                <MarkerButton disabled={calculating}
                              onClick={() => {createFromMarker()}}
                              marker={from_marker}>
                    From
                </MarkerButton>
                <MarkerButton disabled={calculating}
                              onClick={() => {createToMarker()}}
                              marker={to_marker}>
                    To
                </MarkerButton>
                

                <Button disabled={!(from_marker.lngLat && to_marker.lngLat) || calculating}
                    loading={calculating}
                    onClick={() => { calculateRoute() }}>
                    Calculate route
                </Button>

                <Input type='text' placeholder='name' 
                        onChange={this.updateActiveRouteText} 
                        value={this.state.active_route_label_input} action
                        disabled={!(from_marker.lngLat && to_marker.lngLat) || calculating} >
                    <input />
                    <Button type='submit' 
                        onClick={() => {saveCurrentRoute(this.state.active_route_label_input)}} 
                        disabled={!(from_marker.lngLat && to_marker.lngLat) || calculating} >
                            Save route
                    </Button>
                </Input>

                <Dropdown
                    options={selectable_routes}
                    placeholder='Choose routes to display'
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
            </Container>
        );
    }
}

export default MapToolbar;