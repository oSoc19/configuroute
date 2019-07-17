import React from "react";
import Modal from "react-modal";
import "./landingPage.css";
import Index from "./Index.jsx";
import Upload from "./Upload.jsx";
import NewConfigFileForm from "./NewFileForm";

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
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  }
};

function Content(props) {
  switch (props.modal.state.content) {
    case "INDEX":
      return <Index modal={props.modal} />;
    case "UPLOAD":
      return <Upload modal={props.modal} />;
    case "NEW":
      return <NewConfigFileForm modal={props.modal} />;
    default:
      return null;
  }
}

Modal.setAppElement("#root");

const ruleTypes = {
  hasAccessRules: {
    conclusion: "hasAccess",
    defaultValue: false
  },
  hasObstacleRules: {
    conclusion: "isObstacle",
    defaultValue: true
  },
  hasOnewayRules: {
    conclusion: "isOneway",
    defaultValue: true
  },
  hasPriorityRules: {
    conclusion: "isReversed",
    defaultValue: 0
  },
  hasSpeedRules: {
    conclusion: "hasSpeed",
    defaultValue: 35
  }
};

class LandingPage extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: true,
      content: "INDEX",
      data: "",
      ruleTypes: ruleTypes
    };

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleChangeContent(content, data) {
    this.setState({ content: content, data: data });
  }

  handleConfirm(configFile) {
    this.props.onConfirm(configFile);
    this.handleCloseModal();
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
