// import "solid-devtools";

import { createSignal, type Component, For } from "solid-js";

// import { Bluefish } from "../src/bluefish";
// import Background from "../src/background";
// import { StackH } from "../src/stackh";
// import Circle from "../src/circle";
// import Ref from "../src/ref";
// import Arrow from "../src/arrow";
// import Text from "../src/text";
// import { StackV } from "../src/stackv";
// import Group from "../src/group";
import { Pulley } from "../src/pulley";
import { TraversalOutputComponent } from "../benthic/priority-traversal";
import { Hypergraph } from "../benthic/priority-traversal-types";

const arr = Array.from({ length: 1000 }, (_, i) => i + 1);

const App: Component = () => {
  const planetsHypergraph: Hypergraph = {
    "0": {
      id: "0",
      displayName: "Planets Diagram",
      description: "Planets Diagram in Bluefish",
      parents: [],
      children: ["1", "6"],
      priority: 0,
    },
    "1": {
      id: "1",
      displayName: "Background",
      description:
        "Rectangular bounding box containing a row of the four closest planets to the sun. Mercury is at the left of the row.",
      parents: ["0"],
      children: ["2", "3", "4", "5"],
      priority: 1,
    },
    "2": {
      id: "2",
      displayName: "Mercury",
      description: "Circle representing Mercury, the closest planet to the sun",
      parents: ["1", "6"],
      children: [],
      priority: 2,
    },
    "3": {
      id: "3",
      displayName: "Venus",
      description: "Circle representing Venus, the second planet from the sun",
      parents: ["1"],
      children: [],
      priority: 2,
    },
    "4": {
      id: "4",
      displayName: "Earth",
      description: "Circle representing Earth, the third planet from the sun",
      parents: ["1"],
      children: [],
      priority: 2,
    },
    "5": {
      id: "5",
      displayName: "Mars",
      description: "Circle representing Mars, the fourth planet from the sun",
      parents: ["1"],
      children: [],
      priority: 2,
    },
    "6": {
      id: "6",
      displayName: "Text Annotation",
      description:
        "Text annotation on the Mercury node. Text label says Mercury",
      parents: ["0"],
      children: ["2"],
      priority: 2,
    },
  };

  const stackedBarChartHypergraph: Hypergraph = {
    "0": {
      id: "0",
      displayName: "Stacked Bar Chart",
      description:
        "Major Trophies for some English teams. Stacked bar chart. With axes team and sum trophies.",
      descriptionTokens: {
        label: "Stacked Bar Chart",
      },
      parents: [],
      children: ["1", "2", "22"],
      priority: 0,
    },
    "1": {
      id: "1",
      displayName: "X-axis",
      description: "X Axis. Arsenal, Chelsea, Liverpool, Manchester United.",
      descriptionTokens: {
        label: "X-axis",
      },
      parents: ["0"],
      children: ["3", "4", "5", "6"],
      priority: 1,
    },
    "2": {
      id: "2",
      displayName: "Legend",
      description: "Legend. Contest included: BPL, FA Cup, CL.",
      descriptionTokens: {
        label: "Legend",
      },
      parents: ["0"],
      children: ["7", "8", "9"],
      priority: 2,
    },
    "3": {
      id: "3",
      displayName: "Arsenal",
      description:
        "Team: Arsenal. Total trophies: 17. Contains: 3 contests. Bar representing the number of trophies won by Arsenal.",
      descriptionTokens: {
        label: "Arsenal",
      },
      parents: ["1"],
      children: ["10", "11", "12"],
      priority: 2,
    },
    "4": {
      id: "4",
      displayName: "Chelsea",
      description:
        "Team: Chelsea. Total trophies: 15. Contains: 3 contests. Bar representing the number of trophies won by Chelsea.",
      descriptionTokens: {
        label: "Chelsea",
      },
      parents: ["1"],
      children: ["13", "14", "15"],
      priority: 2,
    },
    "5": {
      id: "5",
      displayName: "Liverpool",
      description:
        "Team: Liverpool. Total trophies: 15. Contains: 3 contests. Bar representing the number of trophies won by Liverpool",
      descriptionTokens: {
        label: "Liverpool",
      },
      parents: ["1"],
      children: ["16", "17", "18"],
      priority: 2,
    },
    "6": {
      id: "6",
      displayName: "Manchester",
      description:
        "Team: Manchester United. Total trophies: 28. Contains: 3 contests. Bar representing the number of trophies won by Manchester United.",
      descriptionTokens: {
        label: "Manchester United",
      },
      parents: ["1"],
      children: ["19", "20", "21"],
      priority: 2,
    },
    "7": {
      id: "7",
      displayName: "BPL",
      description:
        "Contest: BPL. Total trophies: 22. Contains: 4 teams. Legend grouping for the BPL competition.",
      descriptionTokens: {
        label: "BPL",
      },
      parents: ["2"],
      children: ["10", "13", "16", "19"],
      priority: 3,
    },
    "8": {
      id: "8",
      displayName: "FA Cup",
      description:
        "Contest: FA Cup. Total trophies: 42. Contains: 4 teams. Legend grouping for the FA Cup competition.",
      descriptionTokens: {
        label: "FA Cup",
      },
      parents: ["2"],
      children: ["11", "14", "17", "20"],
      priority: 3,
    },
    "9": {
      id: "9",
      displayName: "CL",
      description:
        "Contest: CL. Total trophies: 11. Contains: 4 teams. Legend grouping for the CL competition.",
      descriptionTokens: {
        label: "CL",
      },
      parents: ["2"],
      children: ["12", "15", "18", "21"],
      priority: 3,
    },
    "10": {
      id: "10",
      displayName: "Arsenal BPL",
      description: "Team: Arsenal. Contest: BPL. Trophies: 3. Data point.",
      descriptionTokens: {
        label: "Arsenal BPL",
      },
      parents: ["3", "7"],
      children: [],
      priority: 4,
    },
    "11": {
      id: "11",
      displayName: "Arsenal FA Cup",
      description: "Team: Arsenal. Contest: FA Cup. Trophies: 14. Data point.",
      descriptionTokens: {
        label: "Arsenal FA Cup",
      },
      parents: ["3", "8"],
      children: [],
      priority: 4,
    },
    "12": {
      id: "12",
      displayName: "Arsenal CL",
      description: "Team: Arsenal. Contest: CL. Trophies: 0. Data point.",
      descriptionTokens: {
        label: "Arsenal CL",
      },
      parents: ["3", "9"],
      children: [],
      priority: 4,
    },
    "13": {
      id: "13",
      displayName: "Chelsea BPL",
      description: "Team: Chelsea. Contest: BPL. Trophies: 5. Data point.",
      descriptionTokens: {
        label: "Chelsea BPL",
      },
      parents: ["4", "7"],
      children: [],
      priority: 4,
    },
    "14": {
      id: "14",
      displayName: "Chelsea FA Cup",
      description: "Team: Chelsea. Contest: FA Cup. Trophies: 8. Data point.",
      descriptionTokens: {
        label: "Chelsea FA Cup",
      },
      parents: ["4", "8"],
      children: [],
      priority: 4,
    },
    "15": {
      id: "15",
      displayName: "Chelsea CL",
      description: "Team: Chelsea. Contest: CL. Trophies: 2. Data point.",
      descriptionTokens: {
        label: "Chelsea CL",
      },
      parents: ["4", "9"],
      children: [],
      priority: 4,
    },
    "16": {
      id: "16",
      displayName: "Liverpool BPL",
      description: "Team: Liverpool. Contest: BPL. Trophies: 1. Data point.",
      descriptionTokens: {
        label: "Liverpool BPL",
      },
      parents: ["5", "7"],
      children: [],
      priority: 4,
    },
    "17": {
      id: "17",
      displayName: "Liverpool FA Cup",
      description: "Team: Liverpool. Contest: FA Cup. Trophies: 8. Data point.",
      descriptionTokens: {
        label: "Liverpool FA Cup",
      },
      parents: ["5", "8"],
      children: [],
      priority: 4,
    },
    "18": {
      id: "18",
      displayName: "Liverpool CL",
      description: "Team: Liverpool. Contest: CL. Trophies: 6. Data point.",
      descriptionTokens: {
        label: "Liverpool CL",
      },
      parents: ["5", "9"],
      children: [],
      priority: 4,
    },
    "19": {
      id: "19",
      displayName: "Manchester BPL",
      description:
        "Team: Manchester United. Contest: BPL. Trophies: 13. Data point.",
      descriptionTokens: {
        label: "Manchester United BPL",
      },
      parents: ["6", "7"],
      children: [],
      priority: 4,
    },
    "20": {
      id: "20",
      displayName: "Manchester FA Cup",
      description:
        "Team: Manchester United. Contest: FA Cup. Trophies: 12. Data point.",
      descriptionTokens: {
        label: "Manchester United FA Cup",
      },
      parents: ["6", "8"],
      children: [],
      priority: 4,
    },
    "21": {
      id: "21",
      displayName: "Manchester United CL",
      description:
        "Team: Manchester United. Contest: CL. Trophies: 3. Data point.",
      descriptionTokens: {
        label: "Manchester United CL",
      },
      parents: ["6", "9"],
      children: [],
      priority: 4,
    },
    "22": {
      id: "22",
      displayName: "Y-axis",
      description:
        "Y-axis. Label: count trophies. Values range from 0 to 30 on a numerical scale.",
      descriptionTokens: {
        label: "Y-axis",
      },
      parents: ["0"],
      children: [],
      priority: 2,
    },
  };

  const pulleyHypergraph: Hypergraph = {
    "0": {
      id: "0",
      displayName: "Pulley Diagram",
      description: "Pulley System in a Physics Problem",
      parents: [],
      children: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      priority: 0,
    },
    "1": {
      id: "1",
      displayName: "Hangs from",
      description: "Pulley B hangs from Rope T",
      parents: ["0"],
      children: ["13", "15"],
      priority: 1,
    },
    "2": {
      id: "2",
      displayName: "Hangs from",
      description: "Rope T hangs from the Ceiling",
      parents: ["0"],
      children: ["12", "13"],
      priority: 1,
    },
    "3": {
      id: "3",
      displayName: "Hangs from",
      description: "Rope Z hangs from the Ceiling",
      parents: ["0"],
      children: ["12", "14"],
      priority: 1,
    },
    "4": {
      id: "4",
      displayName: "Hangs from",
      description: "Pulley A hangs from Rope X",
      parents: ["0"],
      children: ["16", "24"],
      priority: 1,
    },
    "5": {
      id: "5",
      displayName: "Hangs from",
      description: "Weight W1 hangs from Rope P",
      parents: ["0"],
      children: ["19", "21"],
      priority: 1,
    },
    "6": {
      id: "6",
      displayName: "Hangs from",
      description: "Weight W2 hangs from Rope Q",
      parents: ["0"],
      children: ["20", "22"],
      priority: 1,
    },
    "7": {
      id: "7",
      displayName: "Hangs from",
      description: "Rope S hangs from Pulley C",
      parents: ["0"],
      children: ["18", "23"],
      priority: 1,
    },
    "8": {
      id: "8",
      displayName: "Hangs from",
      description: "Weight W2 hangs from Rope S",
      parents: ["0"],
      children: ["22", "23"],
      priority: 1,
    },
    "9": {
      id: "9",
      displayName: "Pulley System A",
      description:
        "Rope P, Rope Q, and Pulley A are in a pulley system together",
      parents: ["0"],
      children: ["19", "20", "24"],
      priority: 2,
    },
    "10": {
      id: "10",
      displayName: "Pulley System B",
      description:
        "Rope X, Rope Y, and Pulley B are in a pulley system together",
      parents: ["0"],
      children: ["15", "16", "17"],
      priority: 2,
    },
    "11": {
      id: "11",
      displayName: "Pulley System C",
      description:
        "Rope Y, Rope Z, and Pulley C are in a pulley system together",
      parents: ["0"],
      children: ["14", "17", "18"],
      priority: 2,
    },
    "12": {
      id: "12",
      displayName: "Ceiling",
      description: "Wall at the top of the pulley diagram",
      parents: ["2", "3"],
      children: [],
      priority: 3,
    },
    "13": {
      id: "13",
      displayName: "Rope T",
      description: "Rope T in the pulley diagram",
      parents: ["1", "2"],
      children: [],
      priority: 3,
    },
    "14": {
      id: "14",
      displayName: "Rope Z",
      description: "Rope Z in the pulley diagram",
      parents: ["3", "11"],
      children: [],
      priority: 3,
    },
    "15": {
      id: "15",
      displayName: "Pulley B",
      description: "Pulley B in the pulley diagram",
      parents: ["10", "1"],
      children: [],
      priority: 3,
    },
    "16": {
      id: "16",
      displayName: "Rope X",
      description: "Rope X in the pulley diagram",
      parents: ["4", "10"],
      children: [],
      priority: 3,
    },
    "17": {
      id: "17",
      displayName: "Rope Y",
      description: "Rope Y in the pulley diagram",
      parents: ["10", "11"],
      children: [],
      priority: 3,
    },
    "18": {
      id: "18",
      displayName: "Pulley C",
      description: "Pulley C in the pulley diagram",
      parents: ["11", "7"],
      children: [],
      priority: 3,
    },
    "19": {
      id: "19",
      displayName: "Rope P",
      description: "Rope P in the pulley diagram",
      parents: ["5", "9"],
      children: [],
      priority: 3,
    },
    "20": {
      id: "20",
      displayName: "Rope Q",
      description: "Rope Q in the pulley diagram",
      parents: ["6", "9"],
      children: [],
      priority: 3,
    },
    "21": {
      id: "21",
      displayName: "Weight W1",
      description: "Weight W1 in the pulley diagram",
      parents: ["5"],
      children: [],
      priority: 3,
    },
    "22": {
      id: "22",
      displayName: "Weight W2",
      description: "Weight W2 in the pulley diagram",
      parents: ["6", "8"],
      children: [],
      priority: 3,
    },
    "23": {
      id: "23",
      displayName: "Rope S",
      description: "Rope S in the pulley diagram",
      parents: ["7", "8"],
      children: [],
      priority: 3,
    },
    "24": {
      id: "24",
      displayName: "Pulley A",
      description: "Pulley A in the pulley diagram",
      parents: ["4", "9"],
      children: [],
      priority: 3,
    },
  };

  return (
    <>
      {/* <Bluefish
        id="bluefish-planets"
        padding={20}
        aria-data={{
          displayName: "Bluefish",
          description: "Planets Diagram in Bluefish",
        }}
      >
        <Group
          aria-data={{
            displayName: "Group",
            description: "Four closest planets to the sun",
          }}
          rels={() => (
            <>
              <StackV spacing={60} aria-data={{ displayName: "StackV" }}>
                <Ref select="label" />
                <Ref select="mercury" />
              </StackV>
              <Arrow aria-data={{ displayName: "Arrow" }}>
                <Ref select="label" />
                <Ref select="mercury" />
              </Arrow>
            </>
          )}
        >
          <Background aria-data={{ displayName: "Background" }}>
            <StackH spacing={50} aria-data={{ displayName: "StackH" }}>
              <Circle
                name="mercury"
                r={15}
                fill={"#EBE3CF"}
                stroke-width={3}
                stroke={"black"}
                aria-data={{
                  displayName: "Mercury",
                  description: "First Planet",
                }}
              />
              <Circle
                name="venus"
                r={36}
                fill={"#DC933C"}
                stroke-width={3}
                stroke={"black"}
                aria-data={{
                  displayName: "Venus",
                  description: "Second Planet",
                }}
              />
              <Circle
                name="earth"
                r={38}
                fill={"#179DD7"}
                stroke-width={3}
                stroke={"black"}
                aria-data={{ displayName: "Earth" }}
              />
              <Circle
                name="mars"
                r={21}
                fill={"#F1CF8E"}
                stroke-width={3}
                stroke={"black"}
                aria-data={{
                  displayName: "Mars",
                  description: "Fourth Planet",
                }}
              />
            </StackH>
          </Background>
          <Text
            name="label"
            vertical-anchor="start"
            aria-hidden
            width={500}
            aria-data={{
              displayName: "Text",
              description: "Annotation on Mercury",
            }}
          >
            Mercury
          </Text>
        </Group>
      </Bluefish> */}

      {/* <Pulley /> */}
      <br />
      <TraversalOutputComponent
        // nodeGraph={planetsHypergraph}
        nodeGraph={stackedBarChartHypergraph}
        // nodeGraph={pulleyHypergraph}
        showHypergraph={false}
      />
    </>
  );
};

export default App;
