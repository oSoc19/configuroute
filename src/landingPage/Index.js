import React from 'react';
import { Button, Grid, Icon, Header, Image } from "semantic-ui-react";


function Index(props) {
    return( 
        <Grid centered>
        <Grid.Row columns={1} stretched style={{height: '80%', padding: '0'}}>
            <Grid.Column className="contentColumn">
            <div>
                <Header as='h2' icon textAlign='center'>
                    <Image centered rounded src='assets/logo.jpg' className='centerLogo' /> 
                    <Header.Content>Your go-to for creating robust route configurations</Header.Content>
                </Header>
                <Header as='h3' dividing textAlign='center'>
                Purpose
                </Header>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras molestie, orci at mollis scelerisque, ligula nulla 
                hendrerit tellus, ac fermentum magna tellus sit amet lectus. Aenean laoreet felis pretium, vulputate nunc et, dictum
                est. Pellentesque quis metus eleifend nisi viverra blandit. In posuere semper arcu, eu venenatis nunc eleifend sit 
                amet. Sed accumsan elit scelerisque pulvinar porttitor. In hac habitasse platea dictumst. Etiam vitae urna euismod, 
                aliquet dui sit amet, ultricies turpis. Nam lobortis congue augue sed faucibus. Aliquam erat volutpat. Sed dapibus 
                nisi dignissim magna elementum fringilla. Nulla aliquam bibendum felis quis mollis. Proin rhoncus, lectus at posuere 
                condimentum, arcu justo congue mauris, ac molestie massa leo ac ligula. Fusce at ipsum in felis aliquet imperdiet.
                </p>
            </div>
            </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2} stretched style={{height: '20%', padding: '0'}}>
            <Button.Group style={{width: '100%'}}>
                <Button onClick={props.modal.handleCloseModal} icon labelPosition='left'>
                    <Icon name='file outline' style={{width: '20%'}} size='large'/>
                    Create new
                </Button>
                <Button.Or />
                <Button onClick={() => {props.modal.handleChangeContent('UPLOAD');}} icon labelPosition='right'>
                    <Icon name='upload' style={{width: '20%'}} size='large' />
                    Import Existing
                </Button>
            </Button.Group>
        </Grid.Row>
        </Grid>);
}

export default Index;