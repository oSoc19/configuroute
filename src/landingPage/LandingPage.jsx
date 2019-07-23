import React from "react";
import Modal from "react-modal";
import "./landingPage.css";
import Index from "./Index.jsx";
import Upload from "./Upload.jsx";
import NewConfigFileForm from "./NewFileForm";

const customModalStyle = {
  content: {
    width: "60%",
    height: "60%",
    padding: 0,
    borderRadius: '5px',
    outline: "none",
    border: "none",
    top: "50%",
    left: "50%",
    position: "absolute",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#0B132B"
  },
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  }
};

Modal.setAppElement("#root");

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "INDEX",
      fileData: {}
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleChangeContent(content, data) {
    this.setState({ content: content, fileData: data });
  }

  handleConfirm(configFile) {
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
            onConfirm={this.handleConfirm}
            onBack={() => {
              this.handleChangeContent("INDEX");
            }}
            data={this.state.fileData}
            onChangeContent={this.handleChangeContent}
          />
        );
      case "NEW":
        return (
          <NewConfigFileForm
            ruleTypes={this.props.ruleTypes}
            onConfirm={this.handleConfirm}
            onBack={() => {
              this.handleChangeContent("INDEX");
            }}
            onChangeContent={this.handleChangeContent}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.showModal}
        contentLabel="Landing Page"
        style={customModalStyle}
      >
        <this.content />
      </Modal>
    );
  }
}

export default LandingPage;
