import React from "react";
import {
  Card,
  Icon,
  Button,
  Container,
  Select,
  Form,
  Dropdown
} from "semantic-ui-react";

function AddRule(props) {
  const options = [{ key: "p", text: "Type of rule", value: "Priority rule" }];

  return (
    <Form>
      <Form.Select label="Gender" options={options} placeholder="Gender" />
    </Form>
  );
}

class RuleCard extends React.Component {
  render() {
    return (
      <div>
        <Card.Group>
          <Card>
            <Card.Content>
              <Card.Header> Smoothness - Very bad </Card.Header>
              <Card.Meta> Priority rule </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Button animated color="red">
                <Button.Content visible>
                  <Icon name="delete" />
                </Button.Content>
                <Button.Content hidden> delete </Button.Content>
              </Button>

              <Button animated color="blue">
                <Button.Content visible>
                  <Icon name="pencil alternate" />
                </Button.Content>
                <Button.Content hidden>Modify</Button.Content>
              </Button>
            </Card.Content>
          </Card>

          <Card>
            <AddRule />
          </Card>
        </Card.Group>
      </div>
    );
  }
}

export default RuleCard;
