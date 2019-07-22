import React from "react";
import { Item } from "semantic-ui-react";

export default function DescriptionItem(props) {
  return (
    <Item>
      <Item.Content>
        <Item.Header as="a" href={props.href} target="_blank">
          {props.header}
        </Item.Header>
        <Item.Meta>Description</Item.Meta>
        <Item.Description>{props.description}</Item.Description>
      </Item.Content>
    </Item>
  );
}
