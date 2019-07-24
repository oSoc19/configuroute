import React from "react";
import NewRuleForm from "./rules/NewRuleForm";
import { Icon, Item, Dropdown } from "semantic-ui-react";
import RuleItem from "./rules/RuleItem";
import ConfigFileModal from "./ConfigFileModal";
import BasicPropertiesModal from "../basicPropertiesModal";

/**
 * The left pannel component  interfaces the mofification of the configuration 
 * files. It is the actual working environement. The scheme is simple: 
 * we display all the rules currently defined by the profile in a structured 
 * and informative way. The user can then decide to:
 *  - Add a new rule to the configuration file 
    - Modify how a specific rule will impact the planning system
    - Remove a rule from the configuration file
 */
export default class LeftPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewRuleFormModal: false,
      showConfigFile: false,
      activeIndex: 0,
      selectedKeywords: [],
      showBasicPropertiesModal: false
    };
  }

  /**
   * The following set of functions are used to get information from the ontology
   * data structure created when a configuration file is loaded (check
   * queryOntologyForInformation in App.jsx)
   */

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

  /**
   * Handling methods
   */

  handleCloseModal = () => {
    this.setState({ showNewRuleFormModal: false });
  };

  /**
   * Modifies which set of rules are displayed by the accordion in the ui.
   */
  handleAccordionClick = e => {
    const index = parseInt(e.target.id);
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  /**
   * Called when the user wants to add a new rule to the configuration file.
   */
  handleSubmit = formValues => {
    var newActiveIndex =
      Object.keys(this.props.typesOfRuleMetadata).indexOf(formValues.ruleType) +
      1;
    if (newActiveIndex !== this.state.activeIndex)
      this.setState({ activeIndex: newActiveIndex });
    this.handleCloseModal();
    this.props.onNewRuleSubmit(formValues);
  };

  handleSelectedKeywordsChange = (e, { value }) => {
    this.setState({ selectedKeywords: value });
  };

  /**
   * Usefull methods
   */

  /**
   * Generate a list of all keys and values used in the (terms) ontology.
   */
  generateDropdownOptions = () => {
    if (!this.props.loaded) return [];

    var tags = this.props.rulesSelectOptions.tags;
    const keyOptions = Object.keys(tags).map(k => {
      return {
        key: k,
        value: k,
        text: k
      };
    });

    const values = this.props.rulesSelectOptions.values;
    const valueOptions = Object.keys(values).map(k => {
      return {
        key: k,
        value: k,
        text: k
      };
    });

    return [...keyOptions, ...valueOptions];
  };

  /**
   * Returns true if the key or its associated value property matches
   * the selected keyword for the filtering.
   */
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

  /* transform a word written in camel case into its corresponding sentence
   for instance, "hasMaxSpeed" to "has max speed" */
  beautifyString(string) {
    switch (string) {
      case "rdfs:label":
        return "Profile";
      case "hasMaxSpeed":
        return "Max-speed";
      case "usePublicTransport":
        return "Public transportation";
      default:
    }

    var upperCasesIndexes = [];

    for (var i = 1; i < string.length; i++) {
      var l = upperCasesIndexes.length + i;
      if (i && string[i] === string[i].toUpperCase()) {
        upperCasesIndexes.push(l);
      }
    }

    upperCasesIndexes.map(index => {
      string = string.slice(0, index) + " " + string.slice(index);
      return string;
    });

    return string;
  }

  /**
   * Function called when the user wants to download the configuration file.
   */
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

  /**
   * Render methods
   */

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
      </React.Fragment>
    );
  };

  displayContent() {
    if (this.props.loaded) {
      // if a configuration file was loaded by the user
      var i = 0;
      return Object.keys(this.props.typesOfRuleMetadata).map(ruleType => {
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
                this.handleAccordionClick(e);
              }}
            >
              <span
                id={i}
                onClick={e => {
                  this.handleAccordionClick(e);
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
            <div className="basic_properties_options">
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
              <button
                className="edit_properties_button"
                onClick={() => {
                  this.setState({ showBasicPropertiesModal: true });
                }}
              >
                <Icon inverted name="pencil" />
              </button>
            </div>
          </div>
          {this.state.showNewRuleFormModal && (
            <NewRuleForm
              showNewRuleFormModal={this.state.showNewRuleFormModal}
              typesOfRuleMetadata={this.props.typesOfRuleMetadata}
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
              typesOfRuleMetadata={this.props.typesOfRuleMetadata}
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
            <div className="filter_container">
              <Dropdown
                style={{ width: "200px" }}
                placeholder="Filter"
                search
                selection
                icon="filter"
                options={this.generateDropdownOptions()}
                value={this.state.selectedKeywords}
                onChange={this.handleSelectedKeywordsChange}
              />
              <button
                className="filter_clear"
                onClick={() => {
                  this.setState({ selectedKeywords: [] });
                }}
              >
                <Icon name="close" />
              </button>
            </div>
            <button
              className="button color_white background_green"
              onClick={() => {
                console.log(this.state.showNewRuleFormModal);
                this.setState({ showNewRuleFormModal: true });
              }}
            >
              <Icon name={"plus"} style={{ width: "20%" }} />
              <span className="border_right">Add a rule</span>
            </button>
          </div>
          <div className="acordion_container">{this.displayContent()}</div>
        </div>
      </div>
    );
  }
}
