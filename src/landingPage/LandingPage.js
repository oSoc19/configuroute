import React from "react";
import Modal from "react-modal";
import { Button } from "semantic-ui-react";
import "./landingPage.css";
import Index from "./Index.js";
import Upload from "./Upload.js";

const customModalStyle = {
  content: {
    width: "80%",
    height: "80%",
    padding: "0",
    borderRadius: "12px",
    outline: "none",
    border: "none",
    top: "50%",
    left: "50%",
    position: "absolute",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)"
  },
  overlay: {}
};

function Content(props) {
  switch (props.modal.state.content) {
    case "INDEX":
      return <Index modal={props.modal} />;
    case "UPLOAD":
      return <Upload modal={props.modal} />;
    default:
      return null;
  }
}

Modal.setAppElement("#root");

class LandingPage extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: true,
      content: "INDEX"
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleChangeContent(content) {
    this.setState({ content: content });
  }

  render() {
    return (
      <Modal
        isOpen={this.state.showModal}
        contentLabel="Landing Page"
        style={customModalStyle}
      >
        <Content modal={this} />
      </Modal>
    );
  }
}

export default LandingPage;
