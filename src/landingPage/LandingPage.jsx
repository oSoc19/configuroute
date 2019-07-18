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

Modal.setAppElement("#root");

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
      content: "INDEX",
      fileData: {}
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
    this.setState({ content: content, fileData: data });
  }

  handleConfirm(configFile) {
    this.handleCloseModal();
    this.props.onConfirm(configFile);
  }

  content = () => {
    switch (this.state.content) {
      case "INDEX":
        return (
          <Index
            ruleTypes={this.props.ruleTypes}
            onChangeContent={this.handleChangeContent}
          />
        );
      case "UPLOAD":
        return (
          <Upload
            ruleTypes={this.props.ruleTypes}
            onChangeContent={this.handleChangeContent}
            onConfirm={this.handleConfirm}
            data={this.state.fileData}
          />
        );
      case "NEW":
        return (
          <NewConfigFileForm
            ruleTypes={this.props.ruleTypes}
            onChangeContent={this.handleChangeContent}
            onConfirm={this.handleConfirm}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.state.showModal}
        contentLabel="Landing Page"
        style={customModalStyle}
      >
        <this.content />
      </Modal>
    );
  }
}

export default LandingPage;
