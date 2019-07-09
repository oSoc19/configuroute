import React from 'react';
import Modal from 'react-modal';
import { Button, Grid, Icon, Header, Image } from "semantic-ui-react";
import './landingPage.css';

const customModalStyle = {
    content : {
        width: '80%',
        height: '80%',
        padding: '0',
        borderRadius: '12px',
        outline: 'none',
        border: 'none',
        top: '50%',
        left: '50%',
        position: 'absolute',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
    }
  };

Modal.setAppElement('#root');

class LandingPage extends React.Component {
  constructor () {
    super();
    this.state = {
      showModal: true
    };
    
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  
  handleOpenModal () {
    this.setState({ showModal: true });
  }
  
  handleCloseModal () {
    this.setState({ showModal: false });
  }

  getSrcFromAssets(filename) {
    return { src: 'url(' + require( '../assets/' + filename ) + ')' }
  }
  
  render () {
    return (
      <div>
        <Button onClick={this.handleOpenModal}>Open Landing Page</Button>
        <Modal 
           isOpen={this.state.showModal}
           contentLabel="Landing Page"
           style={customModalStyle}
        >
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
                        <Image centered size='large' src='https://react.semantic-ui.com/images/wireframe/centered-paragraph.png' />
                    </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} stretched style={{height: '20%', padding: '0'}}>
                    <Button.Group style={{width: '100%'}}>
                        <Button onClick={this.handleCloseModal} icon labelPosition='left'>
                            <Icon name='file outline' style={{width: '20%'}}/>
                            Create new
                        </Button>
                        <Button.Or />
                        <Button onClick={this.handleCloseModal} icon labelPosition='right'>
                            <Icon name='upload' style={{width: '20%'}}/>
                            Import Existing
                        </Button>
                    </Button.Group>
                </Grid.Row>
            </Grid>
        </Modal>
      </div>
    );
  }
}

export default LandingPage;