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
    switch (string) {
      case "rdfs :label":
        return "Profile";
      case "has Max Speed":
        return "Max-speed";
      case "use Public Transport":
        return "Public transportation";
    }
    return string;
  }

  handleClick = e => {
    const index = parseInt(e.target.id);
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  displayContent() {
    if (this.props.loaded) {
      var i = 0;
      return Object.keys(this.props.ruleTypes).map(ruleType => {
        i++;
        var j = 0;
        var count = 0;
        return (
          <div key={i}>
            <button
              className={
                this.state.activeIndex === i ? "accordion active" : "accordion"
              }
              id={i}
              onClick={e => {
                this.handleClick(e);
              }}
            >
              <span
                id={i}
                onClick={e => {
                  this.handleClick(e);
                }}
              >
                {this.beautifyString(ruleType.slice(3))}
              </span>
              <Icon
                name="chevron down"
                size="small"
                id={i}
                style={{ paddingTop: "4px" }}
              />
            </button>
            <div
              className="accordion_panel"
              style={
                this.state.activeIndex === i
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              <Item.Group divided>
                {this.props.configFile[ruleType].map(rule => {
                  if (this.rulesMatchesKeyword(rule)) {
                    count++;
                  }
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
              {count === 0 && (
                <div className="color_white">
                  <p>Nothing to see here, try adding some rules!</p>
                </div>
              )}
            </div>
          </div>
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
        {Object.keys(this.props.configFile).map(key => {
          var value = this.props.configFile[key];
          if (!Array.isArray(value) && !(typeof value === "object")) {
            var k = this.beautifyString(key) + ": ";
            return (
              <div className="color_white basic_properties" key={k}>
                <span>{k}</span>
                <span>
                  <b>{String(value)}</b>
                </span>
              </div>
            );
          }
        })}
        <button
          className="button background_green color_white"
          onClick={() => {
            this.setState({ showBasicPropertiesModal: true });
          }}
        >
          <Icon name="pencil" />
          <span>Edit</span>
        </button>
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
      <div className="Left-panel background_darkblue">
        <img
          src="assets/logo.jpg"
          alt="configuroute logo"
          width="113px"
          height="113px"
        />

        <div className="left_pannel_container">
          <div>
            {this.displayBasicProperties()}
            <Dropdown
              icon="ellipsis vertical"
              pointing
              className="link item color_white"
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
          </div>
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

          <div className="rules_edit_container">
            {
              <Dropdown
                inline
                style={{
                  width: "120px",
                  margin: "12px",
                  height: "45px",
                  padding: "7px"
                }}
                text="Filter"
                search
                closeOnChange
                selection
                multiple
                // floating
                labeled
                // inline
                compact
                allowAdditions
                clearable
                // button
                icon="filter"
                options={this.generateDropdownOptions()}
                value={this.state.selectedKeywords}
                onChange={this.handleSelectedKeywordsChange}
              />
            }
            <button
              className="button color_white background_green"
              onClick={() => {
                this.setState({ showModal: true });
              }}
            >
              <Icon name={"plus"} style={{ width: "20%" }} />
              <span className="border_right">Add a rule</span>
            </button>
          </div>
          {this.displayContent()}
        </div>
      </div>
    );
  }
}
