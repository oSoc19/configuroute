import React from "react";
import NewRuleForm from "./rules/NewRuleForm";
import { Button, Accordion, Icon } from "semantic-ui-react";
import RuleCard from "./rules/RuleCard";

export default class LeftPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
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
                    index={j}
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

  render() {
    return (
      <div className="Left-panel">
        <Button
          primary
          onClick={() => {
            this.setState({ showModal: true });
          }}
        >
          {" "}
          Add a rule{" "}
        </Button>{" "}
        <Accordion fluid styled>
          {this.displayContent()}
        </Accordion>
        {this.state.showModal && (
          <NewRuleForm
            showModal={this.state.showModal}
            ruleOptions={this.props.ruleTypes}
            selectOptions={this.props.rulesSelectOptions}
            onSubmit={this.handleSubmit}
            onClose={this.handleCloseModal}
          />
        )}
      </div>
    );
  }
}
