import React from "react";
import NewConfigFileForm from "./NewFileForm";
import NewRuleForm from "./rules/NewRuleForm";

const configFileContext = {
  "@context": {
    osm: "https://w3id.org/openstreetmap/terms#",
    opp: "https://w3id.org/openplannerteam/profile#",
    prov: "http://www.w3.org/ns/prov#",
    hasMaxSpeed: {
      "@id": "opp:hasMaxSpeed"
    },
    usePublicTransport: {
      "@id": "opp:usePublicTransport"
    },
    hasAccessRules: {
      "@id": "opp:hasAccessRules"
    },
    hasOnewayRules: {
      "@id": "opp:hasOnewayRules"
    },
    hasSpeedRules: {
      "@id": "opp:hasSpeedRules"
    },
    hasPriorityRules: {
      "@id": "opp:hasPriorityRules"
    },
    hasObstacleRules: {
      "@id": "opp:hasObstacleRules"
    },
    hasAccess: {
      "@id": "opp:hasAccess"
    },
    isOneway: {
      "@id": "opp:isOneway"
    },
    isReversed: {
      "@id": "opp:isReversed"
    },
    hasSpeed: {
      "@id": "opp:hasSpeed"
    },
    isObstacle: {
      "@id": "opp:isObstacle"
    },
    hasPriority: {
      "@id": "opp:hasPriority"
    },
    concludes: {
      "@id": "opp:concludes"
    },
    hasOrder: {
      "@id": "opp:hasOrder"
    },
    match: {
      "@id": "opp:match"
    },
    fromProperty: {
      "@id": "opp:fromProperty",
      "@type": "@id"
    },
    hasPredicate: {
      "@id": "opp:hasPredicate",
      "@type": "@id"
    },
    hasObject: {
      "@id": "opp:hasObject",
      "@type": "@id"
    }
  }
};

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
    "osm:OppositeLane",
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
  hasAccessRules: "hasAccess",
  hasObstacleRules: "isObstacle",
  hasOnewayRules: "isOneway",
  hasPriorityRules: "isRevesed",
  hasSpeedRules: "hasSpeed"
};

export default class LeftPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configFile: configFileContext,
      rulesSelectOptions: rulesSelectOptions,
      ruleTypes: ruleTypes
    };
  }

  onNewConfigFileSubmit = formValues => {
    var configFile = { ...this.state.configFile };
    configFile["rdfs:label"] = formValues.description;
    configFile["hasMaxSpeed"] = formValues.maxSpeed;
    configFile["usePublicTransport"] = formValues.usePublicTransport;
    this.setState({ configFile: configFile });
    console.log(JSON.stringify(configFile));
  };

  onNewRuleSubmit = formValues => {
    console.log(formValues);
  };

  render() {
    const { ruleTypes, rulesSelectOptions } = this.state;
    return (
      <div>
        <NewConfigFileForm onSubmit={this.onNewConfigFileSubmit} />
        <NewRuleForm
          ruleOptions={ruleTypes}
          selectOptions={rulesSelectOptions}
          onSubmit={this.onNewRuleSubmit}
        />
      </div>
    );
  }
}
