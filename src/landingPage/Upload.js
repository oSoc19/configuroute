import React from "react";
import { Button, Grid, Icon, Header } from "semantic-ui-react";

class Upload extends React.Component {
  render() {
    return (
      <Grid centered>
        <Grid.Row columns={1} stretched style={{ height: "80%", padding: "0" }}>
          <Grid.Column className="contentColumn">
            <div>
              <form method="post" action="#" id="#" style={{ height: "90%" }}>
                <div className="form-group files" style={{ height: "100%" }}>
                  <Header as="h3">Upload Your File</Header>
                  <input
                    type="file"
                    className="form-control"
                    multiple=""
                    style={{ height: "100%" }}
                  />
                </div>
              </form>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} stretched style={{ height: "20%", padding: "0" }}>
          <Button.Group style={{ width: "100%" }}>
            <Button
              onClick={this.props.modal.handleCloseModal}
              icon
              labelPosition="left"
            >
              <Icon name="file outline" style={{ width: "20%" }} size="large" />
              Open from gist
            </Button>
            <Button.Or />
            <Button
              onClick={this.props.modal.handleCloseModal}
              icon
              labelPosition="right"
            >
              <Icon name="upload" style={{ width: "20%" }} size="large" />
              Open from your device
            </Button>
          </Button.Group>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Upload;
