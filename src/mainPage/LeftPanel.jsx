import React from "react";
import NewRuleForm from "./rules/NewRuleForm";
import {
  Button,
  Accordion,
  Icon,
  Menu,
  Segment,
  Item,
  Dropdown
} from "semantic-ui-react";
import RuleItem from "./rules/RuleItem";
import ConfigFileModal from "./ConfigFileModal";
import BasicPropertiesModal from "../basicPropertiesModal";

export default class LeftPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showConfigFile: false,
      activeIndex: 0,
      selectedKeywords: [],
      showBasicPropertiesModal: false
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

  rulesMatchesKeyword(rule) {
    if (this.state.selectedKeywords.length > 0) {
      if (rule.match) {
        var tags = [rule.match.hasPredicate.slice(4)];
        if (rule.match.hasObject) {
          tags.push(rule.match.hasObject.slice(4));
        }

        return tags
          .map(tag => {
            if (this.state.selectedKeywords.includes(tag)) {
              return true;
            }
            return false;
          })
          .includes(true);
      }
      return false;
    }
    return true;
  }

  insertCharacterInString(string, index, char) {
    if (string.length > index) {
      return string.slice(0, index) + char + string.slice(index);
    }
  }

  beautifyString(stringToChange) {
    var upperCasesIndexes = [];
    var string = stringToChange.slice(0);

    for (var i = 1; i < string.length; i++) {
      var l = upperCasesIndexes.length + i;
      if (i && string[i] === string[i].toUpperCase()) {
        upperCasesIndexes.push(l);
      }
    }

    upperCasesIndexes.map(index => {
      string = this.insertCharacterInString(string, index, " ");
      return string;
    });
    return string;
  }

  displayContent() {
    if (this.props.loaded) {
      var i = 0;
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
              {this.beautifyString(ruleType.slice(3))}
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === i}>
              <Item.Group divided>
                {this.props.configFile[ruleType].map(rule => {
                  return (
                    <RuleItem
                      display={this.rulesMatchesKeyword(rule)}
                      type={ruleType}
                      index={j++}
                      key={JSON.stringify(rule)}
                      rule={rule}
                      onChange={this.props.onRuleConclusionChange}
                      onDelete={this.props.onRuleDelete}
                      getValueLink={this.getValueLink}
                      getValueComment={this.getValueComment}
                      getTagLink={this.getTagLink}
                      getTagComment={this.getTagComment}
                    />
                  );
                })}
              </Item.Group>
            </Accordion.Content>
          </React.Fragment>
        );
      });
    } else {
      return null;
    }
  }

  handleSubmit = formValues => {
    var newActiveIndex =
      Object.keys(this.props.ruleTypes).indexOf(formValues.ruleType) + 1;
    if (newActiveIndex !== this.state.activeIndex)
      this.setState({ activeIndex: newActiveIndex });
    this.handleCloseModal();
    this.props.onNewRuleSubmit(formValues);
  };

  displayBasicProperties = () => {
    return (
      <React.Fragment key={0}>
        <Accordion.Title
          active={this.state.activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          {"Basic properties"}
        </Accordion.Title>
        <Accordion.Content active={this.state.activeIndex === 0}>
          {Object.keys(this.props.configFile).map(key => {
            var value = this.props.configFile[key];
            if (!Array.isArray(value) && !(typeof value === "object")) {
              var text = key + " : " + value;
              return <Segment key={text}> {text} </Segment>;
            }
          })}
          <Button
            secondary
            onClick={() => {
              this.setState({ showBasicPropertiesModal: true });
            }}
          >
            {" "}
            Modify{" "}
          </Button>
        </Accordion.Content>
      </React.Fragment>
    );
  };

  generateDropdownOptions = () => {
    if (!this.props.loaded) return [];

    var tags = this.props.rulesSelectOptions.tags;
    const keyOptions = Object.keys(tags).map(k => {
      return {
        key: k,
        value: k,
        text: k
        //label: { color: "red", empty: true, circular: true }
      };
    });

    const values = this.props.rulesSelectOptions.values;
    const valueOptions = Object.keys(values).map(k => {
      return {
        key: k,
        value: k,
        text: k
        //label: { color: "green", empty: true, circular: true }
      };
    });

    return [...keyOptions, ...valueOptions];
  };

  handleSelectedKeywordsChange = (e, { value }) => {
    this.setState({ selectedKeywords: value });
  };

  download = () => {
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.props.configFile, null, 2))
    );
    element.setAttribute("download", "config.json");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  getLink = description => {
    var link = "";
    Object.keys(description).map(key => {
      if (key.slice(key.indexOf("#") + 1) === "wasInfluencedBy") {
        link = description[key];
      }
      return key;
    });
    return link;
  };

  getComment = description => {
    var comment = "";
    Object.keys(description).map(key => {
      if (key.slice(key.indexOf("#") + 1) === "comment") {
        comment = description[key];
      }
      return key;
    });
    return comment;
  };

  getTagComment = keyName => {
    if (!this.props.rulesSelectOptions.tags[keyName]) return "";
    var description = this.props.rulesSelectOptions.tags[keyName].description;
    if (description) return this.getComment(description);
  };

  getValueComment = valueName => {
    if (!this.props.rulesSelectOptions.values[valueName]) return "";
    var description = this.props.rulesSelectOptions.values[valueName];
    if (description) return this.getComment(description);
  };

  getTagLink = keyName => {
    if (!this.props.rulesSelectOptions.tags[keyName]) return "";

    var description = this.props.rulesSelectOptions.tags[keyName].description;
    if (description) return this.getLink(description);
  };

  getValueLink = valueName => {
    if (!this.props.rulesSelectOptions.values[valueName]) return "";
    var description = this.props.rulesSelectOptions.values[valueName];
    if (description) return this.getLink(description);
  };

  render() {
    return (
      <div className="Left-panel">
        <Menu fluid style={{ margin: "1vw" }}>
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

          <Dropdown
            text="Configuration file options"
            pointing
            className="link item"
          >
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  this.setState({ showConfigFile: true });
                }}
              >
                Show file
              </Dropdown.Item>
              <Dropdown.Item onClick={this.download}>
                Download file
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu>

        {
          <Dropdown
            inline
            style={{ margin: "1vw" }}
            search
            selection
            fluid
            multiple
            allowAdditions
            clearable
            button
            icon="filter"
            options={this.generateDropdownOptions()}
            value={this.state.selectedKeywords}
            onChange={this.handleSelectedKeywordsChange}
          />
        }

        <Accordion fluid styled style={{ margin: "1vw" }}>
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
            beautifyString={this.beautifyString}
            getValueLink={this.getValueLink}
            getValueComment={this.getValueComment}
            getTagLink={this.getTagLink}
            getTagComment={this.getTagComment}
          />
        )}
        {this.state.showConfigFile && (
          <ConfigFileModal
            ruleTypes={this.props.ruleTypes}
            open={this.state.showConfigFile}
            configFile={this.props.configFile}
            onClose={() => {
              this.setState({ showConfigFile: false });
            }}
          />
        )}
        {this.state.showBasicPropertiesModal && (
          <BasicPropertiesModal
            isOpen={this.state.showBasicPropertiesModal}
            onClose={() => {
              this.setState({ showBasicPropertiesModal: false });
            }}
            label={this.props.configFile["rdfs:label"]}
            speed={this.props.configFile["hasMaxSpeed"]}
            transport={this.props.configFile["usePublicTransport"]}
            onConfirm={newProperties => {
              this.props.onChangeBasicProperties(newProperties);
              this.setState({ showBasicPropertiesModal: false });
            }}
          />
        )}
      </div>
    );
  }
}
