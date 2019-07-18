import React from "react";
import { Button, Icon, Label } from 'semantic-ui-react';

export default function MarkerButton(props){
    return(
        <Button disabled={props.disabled} as='div'  labelPosition='right'
                onClick={props.onClick}>
            <Button icon>
                <Icon name='pin icon' />
                {props.children}
            </Button>
            <Label as='a' basic pointing='left'>{props.marker.placed
                && Math.round(props.marker.lngLat.lat * 10000) / 10000 + ", "
                + Math.round(props.marker.lngLat.lng * 10000) / 10000}</Label>
        </Button>
    );
}