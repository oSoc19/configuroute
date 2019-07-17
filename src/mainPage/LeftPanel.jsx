import React from "react";
import NewRuleForm from "./rules/NewRuleForm";
import { Button, Accordion, Icon } from "semantic-ui-react";
import RuleCard from "./rules/RuleCard";
//const Engine = require("./bundle.js");
//import Engine from "./bundle.js";

const rulesSelectOptions = {
  "osm:access": [
    "osm:Agricultural",
    "osm:Customers",
    "osm:Delivery",
    "osm:Designated",
    "osm:Destination",
    "osm:Discouraged",
    "osm:Dismount",
    "osm:Emergency",
    "osm:Forestry",
    "osm:NoAccess",
    "osm:Permissive",
    "osm:Private",
    "osm:UseSidepath",
    "osm:FreeAccess"
  ],
  "osm:barrier": [
    "osm:Block",
    "osm:Bollard",
    "osm:BorderControl",
    "osm:BumpGate",
    "osm:BusTrap",
    "osm:CattleGrid",
    "osm:Chain",
    "osm:CycleBarrier",
    "osm:Debris",
    "osm:Entrance",
    "osm:Gate",
    "osm:LiftGate",
    "osm:SallyPort",
    "osm:SwingGate",
    "osm:TollBooth",
    "osm:Turnstile"
  ],
  "osm:bicycle": [
    "osm:Designated",
    "osm:Destination",
    "osm:Dismount",
    "osm:NoAccess",
    "osm:OfficialAccess",
    "osm:Permissive",
    "osm:Private",
    "osm:UseSidepath",
    "osm:FreeAccess"
  ],
  "osm:construction": ["osm:UnderConstruction"],
  "osm:crossing": ["osm:Uncontrolled", "osm:Unmarked"],
  "osm:cycleway": [
    "osm:Lane",
    "osm:Opposite",
    "osm:OpposciteLane",
    "osm:OppositeTrack",
    "osm:ShareBusway",
    "osm:Shared",
    "osm:SharedLane",
    "osm:Track"
  ],
  "osm:footway": ["osm:Sidewalk"],
  "osm:highway": [
    "osm:Bridleway",
    "osm:UnderConstruction",
    "osm:HighwayCrossing",
    "osm:CycleHighway",
    "osm:FootHighway",
    "osm:GiveWay",
    "osm:LivingStreet",
    "osm:Motorway",
    "osm:MotorwayLink",
    "osm:Path",
    "osm:Primary",
    "osm:PrimaryLink",
    "osm:Proposed",
    "osm:Residential",
    "osm:Road",
    "osm:Secondary",
    "osm:SecondaryLink",
    "osm:Service",
    "osm:Steps",
    "osm:Stop",
    "osm:Tertiary",
    "osm:TertiaryLink",
    "osm:Track",
    "osm:TrafficSignals",
    "osm:Trunk",
    "osm:TrunkLink",
    "osm:Unclassified"
  ],
  "osm:motor_vehicle": [
    "osm:Agricultural",
    "osm:Customers",
    "osm:Delivery",
    "osm:Designated",
    "osm:Destination",
    "osm:NoAccess",
    "osm:Official",
    "osm:Permissive",
    "osm:Private",
    "osm:FreeAccess"
  ],
  "osm:motorcar": [
    "osm:Agricultural",
    "osm:Customers",
    "osm:Delivery",
    "osm:Designated",
    "osm:Destination",
    "osm:Forestry",
    "osm:NoAccess",
    "osm:Official",
    "osm:Permissive",
    "osm:Private",
    "osm:FreeAccess"
  ],
  "osm:oneway_bicycle": [
    "osm:InReverseOrder",
    "osm:InOrder",
    "osm:Bidirectional",
    "osm:InOrder"
  ],
  "osm:oneway": [
    "osm:InReverseOrder",
    "osm:InOrder",
    "osm:InOrder",
    "osm:Bidirectional"
  ],
  "osm:smoothness": [
    "osm:BadSmoothness",
    "osm:ExcellentSmoothness",
    "osm:GoodSmoothness",
    "osm:HorribleSmoothness",
    "osm:ImpassableSmoothness",
    "osm:IntermediateSmoothness",
    "osm:VeryBadSmoothness",
    "osm:VeryHorribleSmoothness"
  ],
  "osm:surface": [
    "osm:Asphalt",
    "osm:Cobblestone",
    "osm:Compacted",
    "osm:Concrete",
    "osm:Dirt",
    "osm:Dirt",
    "osm:FineGravel",
    "osm:Grass",
    "osm:Gravel",
    "osm:Ground",
    "osm:Mud",
    "osm:Paved",
    "osm:PavingStones",
    "osm:Pebblestone",
    "osm:Sand",
    "osm:Sett",
    "osm:UnhewnCobblestone",
    "osm:Unpaved",
    "osm:Wood"
  ],
  "osm:tracktype": [
    "osm:Grade1",
    "osm:Grade2",
    "osm:Grade3",
    "osm:Grade4",
    "osm:Grade5"
  ],
  "osm:vehicle": [
    "osm:Customers",
    "osm:Delivery",
    "osm:Designated",
    "osm:Destination",
    "osm:Forestry",
    "osm:NoAccess",
    "osm:Permissive",
    "osm:Private",
    "osm:FreeAccess"
  ]
};

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

export default class LeftPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      configFile: {},
      rulesSelectOptions: rulesSelectOptions,
      ruleTypes: ruleTypes,
      showModal: false,
      activeIndex: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.configFile !== this.props.configFile) {
      this.setState({ loaded: true, configFile: this.props.configFile });
    }
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
    if (this.state.loaded) {
      var i = -1;
      return Object.keys(ruleTypes).map(k => {
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
              {k}
            </Accordion.Title>
            <Accordion.Content active={this.state.activeIndex === i}>
              {[
                this.state.configFile[k].map(rule => {
                  return (
                    <RuleCard
                      type={k}
                      index={j}
                      key={j++}
                      rule={rule}
                      onChange={this.props.onRuleConclusionChange}
                      onDelete={this.props.onRuleDelete}
                    />
                  );
                })
              ]}
            </Accordion.Content>
          </React.Fragment>
        );
      });
    } else {
      return null;
    }
  }

  render() {
    const { ruleTypes, rulesSelectOptions, activeIndex } = this.state;
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
            onSubmit={this.onNewRuleSubmit}
            ruleOptions={ruleTypes}
            selectOptions={rulesSelectOptions}
            onSubmit={formValues => {
              this.handleCloseModal();
              this.props.onNewRuleSubmit(formValues);
            }}
            onClose={this.handleCloseModal}
          />
        )}
      </div>
    );
  }
}
