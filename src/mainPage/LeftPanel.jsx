import React from "react";
import NewRuleForm from "./rules/NewRuleForm";
import { Button, Accordion, Icon, Menu, Segment } from "semantic-ui-react";
import RuleCard from "./rules/ruleCard";
import ConfigFileModal from "./ConfigFileModal";
import OntologyReader from "../lib/OntologyReader";

export default class LeftPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showConfigFile: false,
      activeIndex: 0
    };
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  displayContent() {
    if (this.props.loaded) {
      var i = -1;
      return Object.keys(this.props.ruleTypes).map(ruleType => {
        i++;
        var j = 0;
        return (
          <React.Fragment key={i}>
            <Accordion.Title
              active={this.state.activeIndex === i}
              index={i}
              onClick={this.handleClick}
            >
              <Icon name="dropdown" />
              {ruleType}
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === i}>
              {this.props.configFile[ruleType].map(rule => {
                return (
                  <RuleCard
                    type={ruleType}
                    index={j++}
                    key={JSON.stringify(rule)}
                    rule={rule}
                    onChange={this.props.onRuleConclusionChange}
                    onDelete={this.props.onRuleDelete}
                  />
                );
              })}
            </Accordion.Content>
          </React.Fragment>
        );
      });
    } else {
      return null;
    }
  }

  handleSubmit = formValues => {
    var newActiveIndex = Object.keys(this.props.ruleTypes).indexOf(
      formValues.ruleType
    );
    if (newActiveIndex != this.state.activeIndex)
      this.setState({ activeIndex: newActiveIndex });
    this.handleCloseModal();
    this.props.onNewRuleSubmit(formValues);
  };

  displayBasicProperties = () => {
    return (
      <React.Fragment key={10}>
        <Accordion.Title
          active={this.state.activeIndex === 10}
          index={10}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          {"Basic properties"}
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndex === 10}>
          {Object.keys(this.props.configFile).map(key => {
            var value = this.props.configFile[key];
            if (!Array.isArray(value) && !(typeof value === "object")) {
              var text = key + " : " + value;
              return <Segment key={text}> {text} </Segment>;
            }
          })}
        </Accordion.Content>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div className="Left-panel">
        <Menu style={{margin: '12px', width: '100%'}}>
          {/*<Menu.Item>
            <img src="./assets/logo.jpg" />
          </Menu.Item>*/}
          <Menu.Item>
            <Button
              primary
              onClick={() => {
                this.setState({ showModal: true });
              }}
            >
              Add a rule
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button
              onClick={() => {
                this.setState({ showConfigFile: true });
              }}
              secondary
            >
              Display config file
            </Button>
          </Menu.Item>
        </Menu>

        <Accordion fluid styled style={{margin: '12px',}}>
          {this.displayBasicProperties()}
          {this.displayContent()}
        </Accordion>
        {this.state.showModal && (
          <NewRuleForm
            showModal={this.state.showModal}
            ruleTypes={this.props.ruleTypes}
            selectOptions={this.props.rulesSelectOptions}
            onSubmit={this.handleSubmit}
            onClose={this.handleCloseModal}
          />
        )}
        {this.state.showConfigFile && (
          <ConfigFileModal
            open={this.state.showConfigFile}
            configFile={this.props.configFile}
            onClose={() => {
              this.setState({ showConfigFile: false });
            }}
          />
        )}
      </div>
    );
  }
}
