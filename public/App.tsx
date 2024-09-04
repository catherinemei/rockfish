// import "solid-devtools";

import { createSignal, type Component, For } from "solid-js";
import { Pulley } from "../src/pulley";
import { TraversalOutputComponent } from "../benthic/priority-traversal";
import { TraversalOutputComponentKeyboardOnly } from "../benthic/old/priority-traversal-keyboard";
import { TraversalOutputComponentKeyboardFlat } from "../benthic/priority-traversal-flat-keyboard";
import { TraversalOutputComponentKeyboardParentFocus } from "../benthic/priority-traversal-parent-focus";
import { Hypergraph } from "../benthic/priority-traversal-types";
import { TraverseObjRelComponent } from "../benthic/obj-rel-traversal";
import { NodeMap } from "../benthic/obj-rel-traversal-types";

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
        shortDescription: "Major Trophies for some English teams.",
        longDescription:
          "Major Trophies for some English teams. Stacked bar chart. With axes team and sum trophies.",
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
        shortDescription: "Contains 4 teams.",
        longDescription:
          "Contains Arsenal, Chelsea, Liverpool, Manchester United.",
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
        shortDescription: "Contains 3 contests.",
        longDescription: "Contains BPL, FA Cup, CL.",
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
        shortDescription: "Contains: 3 contests. Total trophies: 17.",
        longDescription:
          "Team: Arsenal. Total trophies: 17. Contains: 3 contests. Bar representing the number of trophies won by Arsenal.",
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
        shortDescription: "Contains: 3 contests. Total trophies: 15.",
        longDescription:
          "Team: Chelsea. Total trophies: 15. Contains: 3 contests. Bar representing the number of trophies won by Chelsea.",
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
        shortDescription: "Contains: 3 contests. Total trophies: 15.",
        longDescription:
          "Team: Liverpool. Total trophies: 15. Contains: 3 contests. Bar representing the number of trophies won by Liverpool",
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
        shortDescription: "Contains: 3 contests. Total trophies: 28.",
        longDescription:
          "Team: Manchester United. Total trophies: 28. Contains: 3 contests. Bar representing the number of trophies won by Manchester United.",
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
        shortDescription: "Contains: 4 teams. Total trophies: 22.",
        longDescription:
          "Contest: BPL. Total trophies: 22. Contains: 4 teams. Legend grouping for the BPL competition.",
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
        shortDescription: "Contains: 4 teams. Total trophies: 42.",
        longDescription:
          "Contest: FA Cup. Total trophies: 42. Contains: 4 teams. Legend grouping for the FA Cup competition.",
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
        shortDescription: "Contains: 4 teams. Total trophies: 11.",
        longDescription:
          "Contest: CL. Total trophies: 11. Contains: 4 teams. Legend grouping for the CL competition.",
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
        shortDescription: "Trophies: 3.",
        longDescription:
          "Team: Arsenal. Contest: BPL. Trophies: 3. Data point.",
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
        shortDescription: "Trophies: 14.",
        longDescription:
          "Team: Arsenal. Contest: FA Cup. Trophies: 14. Data point.",
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
        shortDescription: "Trophies: 0.",
        longDescription: "Team: Arsenal. Contest: CL. Trophies: 0. Data point.",
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
        shortDescription: "Trophies: 5.",
        longDescription:
          "Team: Chelsea. Contest: BPL. Trophies: 5. Data point.",
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
        shortDescription: "Trophies: 8.",
        longDescription:
          "Team: Chelsea. Contest: FA Cup. Trophies: 8. Data point.",
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
        shortDescription: "Trophies: 2.",
        longDescription: "Team: Chelsea. Contest: CL. Trophies: 2. Data point.",
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
        shortDescription: "Trophies: 1.",
        longDescription:
          "Team: Liverpool. Contest: BPL. Trophies: 1. Data point.",
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
        shortDescription: "Trophies: 8.",
        longDescription:
          "Team: Liverpool. Contest: FA Cup. Trophies: 8. Data point.",
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
        shortDescription: "Trophies: 6.",
        longDescription:
          "Team: Liverpool. Contest: CL. Trophies: 6. Data point.",
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
        shortDescription: "Trophies: 13.",
        longDescription:
          "Team: Manchester United. Contest: BPL. Trophies: 13. Data point.",
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
        shortDescription: "Trophies: 12.",
        longDescription:
          "Team: Manchester United. Contest: FA Cup. Trophies: 12. Data point.",
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
        shortDescription: "Trophies: 3.",
        longDescription:
          "Team: Manchester United. Contest: CL. Trophies: 3. Data point.",
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
        shortDescription: "Y-axis. Count trophies.",
        longDescription:
          "Y-axis. Label: count trophies. Values range from 0 to 30 on a numerical scale.",
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
      description: "Pulley system with 3 pulleys and 9 ropes.",
      descriptionTokens: {
        label: "Pulley Diagram",
        longDescription: "Pulley system with 3 pulleys and 9 ropes.",
      },
      parents: [],
      children: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
      priority: 0,
    },
    "1": {
      id: "1",
      displayName: "Pulley B Hangs from Rope T",
      description: "Pulley B hangs from Rope T.",
      descriptionTokens: {
        label: "Pulley B hangs from Rope T",
      },
      parents: ["0"],
      children: ["13", "15"],
      priority: 1,
    },
    "2": {
      id: "2",
      displayName: "Rope T Hangs from Ceiling",
      description: "Rope T hangs from the ceiling.",
      descriptionTokens: {
        label: "Rope T hangs from the ceiling",
      },
      parents: ["0"],
      children: ["12", "13"],
      priority: 1,
    },
    "3": {
      id: "3",
      displayName: "Rope Z Hangs from Ceiling",
      description: "Rope Z hangs from the ceiling.",
      descriptionTokens: {
        label: "Rope Z hangs from the ceiling",
      },
      parents: ["0"],
      children: ["12", "14"],
      priority: 1,
    },
    "4": {
      id: "4",
      displayName: "Pulley A Hangs from Rope X",
      description: "Pulley A hangs from Rope X.",
      descriptionTokens: {
        label: "Pulley A hangs from Rope X",
      },
      parents: ["0"],
      children: ["16", "24"],
      priority: 1,
    },
    "5": {
      id: "5",
      displayName: "Weight W1 Hangs from Rope P",
      description: "Weight W1 hangs from Rope P.",
      descriptionTokens: {
        label: "Weight W1 hangs from Rope P",
      },
      parents: ["0"],
      children: ["19", "21"],
      priority: 1,
    },
    "6": {
      id: "6",
      displayName: "Weight W2 Hangs from Rope Q",
      description: "Weight W2 hangs from Rope Q.",
      descriptionTokens: {
        label: "Weight W2 hangs from Rope Q",
      },
      parents: ["0"],
      children: ["20", "22"],
      priority: 1,
    },
    "7": {
      id: "7",
      displayName: "Rope S Hangs from Pulley C",
      description: "Rope S hangs from Pulley C.",
      descriptionTokens: {
        label: "Rope S hangs from Pulley C",
      },
      parents: ["0"],
      children: ["18", "23"],
      priority: 1,
    },
    "8": {
      id: "8",
      displayName: "Weight W2 Hangs from Rope S",
      description: "Weight W2 hangs from Rope S.",
      descriptionTokens: {
        label: "Weight W2 hangs from Rope S",
      },
      parents: ["0"],
      children: ["22", "23"],
      priority: 1,
    },
    "9": {
      id: "9",
      displayName: "Pulley System A",
      description: "Pulley System A with Rope P, Rope Q, and Pulley A.",
      descriptionTokens: {
        label: "Pulley System A",
        longDescription: "Pulley System A with Rope P, Rope Q, and Pulley A.",
      },
      parents: ["0"],
      children: ["19", "20", "24"],
      priority: 2,
    },
    "10": {
      id: "10",
      displayName: "Pulley System B",
      description: "Pulley System B with Rope X, Rope Y, and Pulley B.",
      descriptionTokens: {
        label: "Pulley System B",
        longDescription: "Pulley System B with Rope X, Rope Y, and Pulley B.",
      },
      parents: ["0"],
      children: ["15", "16", "17"],
      priority: 2,
    },
    "11": {
      id: "11",
      displayName: "Pulley System C",
      description: "Pulley System C with Rope Y, Rope Z, and Pulley C.",
      descriptionTokens: {
        label: "Pulley System C",
        longDescription: "Pulley System C with Rope Y, Rope Z, and Pulley C.",
      },
      parents: ["0"],
      children: ["14", "17", "18"],
      priority: 2,
    },
    "12": {
      id: "12",
      displayName: "Ceiling",
      description: "Ceiling in the pulley diagram.",
      descriptionTokens: {
        label: "Ceiling",
      },
      parents: ["2", "3"],
      children: [],
      priority: 3,
    },
    "13": {
      id: "13",
      displayName: "Rope T",
      description: "Rope T in the pulley diagram.",
      descriptionTokens: {
        label: "Rope T",
      },
      parents: ["1", "2"],
      children: [],
      priority: 3,
    },
    "14": {
      id: "14",
      displayName: "Rope Z",
      description: "Rope Z in the pulley diagram.",
      descriptionTokens: {
        label: "Rope Z",
      },
      parents: ["3", "11"],
      children: [],
      priority: 3,
    },
    "15": {
      id: "15",
      displayName: "Pulley B",
      description: "Pulley B in the pulley diagram.",
      descriptionTokens: {
        label: "Pulley B",
      },
      parents: ["10", "1"],
      children: [],
      priority: 3,
    },
    "16": {
      id: "16",
      displayName: "Rope X",
      description: "Rope X in the pulley diagram.",
      descriptionTokens: {
        label: "Rope X",
      },
      parents: ["4", "10"],
      children: [],
      priority: 3,
    },
    "17": {
      id: "17",
      displayName: "Rope Y",
      description: "Rope Y in the pulley diagram.",
      descriptionTokens: {
        label: "Rope Y",
      },
      parents: ["10", "11"],
      children: [],
      priority: 3,
    },
    "18": {
      id: "18",
      displayName: "Pulley C",
      description: "Pulley C in the pulley diagram.",
      descriptionTokens: {
        label: "Pulley C",
      },
      parents: ["11", "7"],
      children: [],
      priority: 3,
    },
    "19": {
      id: "19",
      displayName: "Rope P",
      description: "Rope P in the pulley diagram.",
      descriptionTokens: {
        label: "Rope P",
      },
      parents: ["5", "9"],
      children: [],
      priority: 3,
    },
    "20": {
      id: "20",
      displayName: "Rope Q",
      description: "Rope Q in the pulley diagram.",
      descriptionTokens: {
        label: "Rope Q",
      },
      parents: ["6", "9"],
      children: [],
      priority: 3,
    },
    "21": {
      id: "21",
      displayName: "Weight W1",
      description: "Weight W1 in the pulley diagram.",
      descriptionTokens: {
        label: "Weight W1",
      },
      parents: ["5"],
      children: [],
      priority: 3,
    },
    "22": {
      id: "22",
      displayName: "Weight W2",
      description: "Weight W2 in the pulley diagram.",
      descriptionTokens: {
        label: "Weight W2",
      },
      parents: ["6", "8"],
      children: [],
      priority: 3,
    },
    "23": {
      id: "23",
      displayName: "Rope S",
      description: "Rope S in the pulley diagram.",
      descriptionTokens: {
        label: "Rope S",
      },
      parents: ["7", "8"],
      children: [],
      priority: 3,
    },
    "24": {
      id: "24",
      displayName: "Pulley A",
      description: "Pulley A in the pulley diagram.",
      descriptionTokens: {
        label: "Pulley A",
      },
      parents: ["4", "9"],
      children: [],
      priority: 3,
    },
  };

  // Topology data structure for diagram in bottom right hand corner (contains all subsets)
  const topologyHypergraph: Hypergraph = {
    "0": {
      id: "0",
      displayName: "Topology Diagram",
      description:
        "A topology diagram illustrating every subset of a three-element set X containing A, B, C.",
      descriptionTokens: {
        label: "Topology Diagram",
        longDescription:
          "A topology diagram illustrating every subset of a three-element set X containing A, B, C.",
      },
      parents: [],
      children: ["1", "2", "3", "4", "5", "6", "7", "8"],
      priority: 0,
    },
    "1": {
      id: "1",
      displayName: "Empty Set",
      description: "Empty set in the topology diagram.",
      descriptionTokens: {
        label: "Empty Set",
      },
      parents: ["0"],
      children: [],
      priority: 4,
    },
    "2": {
      id: "2",
      displayName: "Subset A",
      description: "Subset containing element A in the topology diagram.",
      descriptionTokens: {
        label: "Subset A",
        longDescription: "Subset containing element A in the topology diagram.",
      },
      parents: ["0"],
      children: ["9"],
      priority: 3,
    },
    "3": {
      id: "3",
      displayName: "Subset B",
      description: "Subset containing element B in the topology diagram.",
      descriptionTokens: {
        label: "Subset B",
        longDescription: "Subset containing element B in the topology diagram.",
      },
      parents: ["0"],
      children: ["10"],
      priority: 3,
    },
    "4": {
      id: "4",
      displayName: "Subset C",
      description: "Subset containing element C in the topology diagram.",
      descriptionTokens: {
        label: "Subset C",
        longDescription: "Subset containing element C in the topology diagram.",
      },
      parents: ["0"],
      children: ["11"],
      priority: 3,
    },
    "5": {
      id: "5",
      displayName: "Subset AB",
      description:
        "Subset containing elements A and B in the topology diagram.",
      descriptionTokens: {
        label: "Subset AB",
        longDescription:
          "Subset containing elements A and B in the topology diagram.",
      },
      parents: ["0"],
      children: ["9", "10"],
      priority: 2,
    },
    "6": {
      id: "6",
      displayName: "Subset AC",
      description:
        "Subset containing elements A and C in the topology diagram.",
      descriptionTokens: {
        label: "Subset AC",
        longDescription:
          "Subset containing elements A and C in the topology diagram.",
      },
      parents: ["0"],
      children: ["9", "11"],
      priority: 2,
    },
    "7": {
      id: "7",
      displayName: "Subset BC",
      description:
        "Subset containing elements B and C in the topology diagram.",
      descriptionTokens: {
        label: "Subset BC",
        longDescription:
          "Subset containing elements B and C in the topology diagram.",
      },
      parents: ["0"],
      children: ["10", "11"],
      priority: 2,
    },
    "8": {
      id: "8",
      displayName: "Subset ABC",
      description:
        "Subset containing elements A, B, and C in the topology diagram.",
      descriptionTokens: {
        label: "Subset ABC",
        longDescription:
          "Subset containing elements A, B, and C in the topology diagram.",
      },
      parents: ["0"],
      children: ["9", "10", "11"],
      priority: 1,
    },
    "9": {
      id: "9",
      displayName: "Element A",
      description: "Element A in the topology diagram.",
      descriptionTokens: {
        label: "Element A",
      },
      parents: ["2", "5", "6", "8"],
      children: [],
      priority: 4,
    },
    "10": {
      id: "10",
      displayName: "Element B",
      description: "Element B in the topology diagram.",
      descriptionTokens: {
        label: "Element B",
      },
      parents: ["3", "5", "7", "8"],
      children: [],
      priority: 4,
    },
    "11": {
      id: "11",
      displayName: "Element C",
      description: "Element C in the topology diagram.",
      descriptionTokens: {
        label: "Element C",
      },
      parents: ["4", "6", "7", "8"],
      children: [],
      priority: 4,
    },
  };

  const planetsNodeMap: NodeMap = {
    "0": {
      id: "0",
      displayName: "Planets Diagram",
      nodeType: "object",
      description: "Planets Diagram in Bluefish",
      parentId: "",
      children: ["1", "6"],
      relations: [],
    },
    "1": {
      id: "1",
      displayName: "Background",
      nodeType: "object",
      description:
        "Rectangular bounding box containing a row of the four closest planets to the sun. Mercury is at the left of the row.",
      parentId: "0",
      children: ["2", "3", "4", "5"],
      relations: [],
    },

    "2": {
      id: "2",
      displayName: "Mercury",
      nodeType: "object",
      description: "Circle representing Mercury, the closest planet to the sun",
      parentId: "1",
      children: [],
      relations: ["7", "8"],
    },

    "3": {
      id: "3",
      displayName: "Venus",
      nodeType: "object",
      description: "Circle representing Venus, the second planet from the sun",
      parentId: "1",
      children: [],
      relations: ["8"],
    },

    "4": {
      id: "4",
      displayName: "Earth",
      nodeType: "object",
      description: "Circle representing Earth, the third planet from the sun",
      parentId: "1",
      children: [],
      relations: ["8"],
    },

    "5": {
      id: "5",
      displayName: "Mars",
      nodeType: "object",
      description: "Circle representing Mars, the fourth planet from the sun",
      parentId: "1",
      children: [],
      relations: ["8"],
    },

    "6": {
      id: "6",
      displayName: "Text Annotation",
      nodeType: "object",
      description:
        "Text annotation on the Mercury node. Text label says Mercury",
      parentId: "0",
      children: [],
      relations: ["7"],
    },
    "7": {
      id: "7",
      displayName: "Arrow",
      nodeType: "relation",
      description: "Arrow mark relating text and Mercury node",
      members: ["2", "6"],
    },
    "8": {
      id: "8",
      displayName: "Row",
      nodeType: "relation",
      description: "Row of circles representing planets",
      members: ["2", "3", "4", "5"],
    },
  };

  const stackedBarChartNodeMap: NodeMap = {
    "0": {
      id: "0",
      displayName: "Stacked Bar Chart",
      nodeType: "object",
      description:
        "Major Trophies for some English teams. Stacked bar chart. With axes team and sum trophies.",
      parentId: "",
      children: ["1", "22"],
      relations: ["2"],
    },
    "1": {
      id: "1",
      displayName: "X-axis",
      nodeType: "object",
      description: "X Axis. Arsenal, Chelsea, Liverpool, Manchester United.",
      parentId: "0",
      children: ["3", "4", "5", "6"],
      relations: [],
    },
    "2": {
      id: "2",
      displayName: "Legend",
      nodeType: "relation",
      description: "Legend. Contest included: BPL, FA Cup, CL.",
      members: ["7", "8", "9"],
    },
    "3": {
      id: "3",
      displayName: "Arsenal",
      nodeType: "object",
      description:
        "Team: Arsenal. Total trophies: 17. Contains: 3 contests. Bar representing the number of trophies won by Arsenal.",
      parentId: "1",
      children: ["10", "11", "12"],
      relations: ["7", "8", "9"],
    },
    "4": {
      id: "4",
      displayName: "Chelsea",
      nodeType: "object",
      description:
        "Team: Chelsea. Total trophies: 15. Contains: 3 contests. Bar representing the number of trophies won by Chelsea.",
      parentId: "1",
      children: ["13", "14", "15"],
      relations: ["7", "8", "9"],
    },
    "5": {
      id: "5",
      displayName: "Liverpool",
      nodeType: "object",
      description:
        "Team: Liverpool. Total trophies: 15. Contains: 3 contests. Bar representing the number of trophies won by Liverpool",
      parentId: "1",
      children: ["16", "17", "18"],
      relations: ["7", "8", "9"],
    },
    "6": {
      id: "6",
      displayName: "Manchester United",
      nodeType: "object",
      description:
        "Team: Manchester United. Total trophies: 28. Contains: 3 contests. Bar representing the number of trophies won by Manchester United.",
      parentId: "1",
      children: ["19", "20", "21"],
      relations: ["7", "8", "9"],
    },
    "7": {
      id: "7",
      displayName: "BPL",
      nodeType: "relation",
      description:
        "Contest: BPL. Total trophies: 22. Contains: 4 teams. Legend grouping for the BPL competition.",
      members: ["10", "13", "16", "19"],
    },
    "8": {
      id: "8",
      displayName: "FA Cup",
      nodeType: "relation",
      description:
        "Contest: FA Cup. Total trophies: 42. Contains: 4 teams. Legend grouping for the FA Cup competition.",
      members: ["11", "14", "17", "20"],
    },
    "9": {
      id: "9",
      displayName: "CL",
      nodeType: "relation",
      description:
        "Contest: CL. Total trophies: 11. Contains: 4 teams. Legend grouping for the CL competition.",
      members: ["12", "15", "18", "21"],
    },
    "10": {
      id: "10",
      displayName: "Arsenal BPL",
      nodeType: "object",
      description: "Team: Arsenal. Contest: BPL. Trophies: 3. Data point.",
      parentId: "3",
      children: [],
      relations: ["7"],
    },
    "11": {
      id: "11",
      displayName: "Arsenal FA Cup",
      nodeType: "object",
      description: "Team: Arsenal. Contest: FA Cup. Trophies: 14. Data point.",
      parentId: "3",
      children: [],
      relations: ["8"],
    },
    "12": {
      id: "12",
      displayName: "Arsenal CL",
      nodeType: "object",
      description: "Team: Arsenal. Contest: CL. Trophies: 0. Data point.",
      parentId: "3",
      children: [],
      relations: ["9"],
    },
    "13": {
      id: "13",
      displayName: "Chelsea BPL",
      nodeType: "object",
      description: "Team: Chelsea. Contest: BPL. Trophies: 5. Data point.",
      parentId: "4",
      children: [],
      relations: ["7"],
    },
    "14": {
      id: "14",
      displayName: "Chelsea FA Cup",
      nodeType: "object",
      description: "Team: Chelsea. Contest: FA Cup. Trophies: 8. Data point.",
      parentId: "4",
      children: [],
      relations: ["8"],
    },
    "15": {
      id: "15",
      displayName: "Chelsea CL",
      nodeType: "object",
      description: "Team: Chelsea. Contest: CL. Trophies: 2. Data point.",
      parentId: "4",
      children: [],
      relations: ["9"],
    },
    "16": {
      id: "16",
      displayName: "Liverpool BPL",
      nodeType: "object",
      description: "Team: Liverpool. Contest: BPL. Trophies: 1. Data point.",
      parentId: "5",
      children: [],
      relations: ["7"],
    },
    "17": {
      id: "17",
      displayName: "Liverpool FA Cup",
      nodeType: "object",
      description: "Team: Liverpool. Contest: FA Cup. Trophies: 8. Data point.",
      parentId: "5",
      children: [],
      relations: ["8"],
    },
    "18": {
      id: "18",
      displayName: "Liverpool CL",
      nodeType: "object",
      description: "Team: Liverpool. Contest: CL. Trophies: 6. Data point.",
      parentId: "5",
      children: [],
      relations: ["9"],
    },
    "19": {
      id: "19",
      displayName: "Manchester United BPL",
      nodeType: "object",
      description:
        "Team: Manchester United. Contest: BPL. Trophies: 13. Data point.",
      parentId: "6",
      children: [],
      relations: ["7"],
    },
    "20": {
      id: "20",
      displayName: "Manchester United FA Cup",
      nodeType: "object",
      description:
        "Team: Manchester United. Contest: FA Cup. Trophies: 12. Data point.",
      parentId: "6",
      children: [],
      relations: ["8"],
    },
    "21": {
      id: "21",
      displayName: "Manchester United CL",
      nodeType: "object",
      description:
        "Team: Manchester United. Contest: CL. Trophies: 3. Data point.",
      parentId: "6",
      children: [],
      relations: ["9"],
    },
    "22": {
      id: "22",
      displayName: "Y-axis",
      nodeType: "object",
      description:
        "Y-axis. Label: count trophies. Values range from 0 to 30 on a numerical scale.",
      parentId: "0",
      children: [],
      relations: [],
    },
  };

  return (
    <>
      <TraversalOutputComponentKeyboardFlat
        // nodeGraph={planetsHypergraph}
        nodeGraph={stackedBarChartHypergraph}
        // nodeGraph={topologyHypergraph}
        // nodeGraph={pulleyHypergraph}
        showHypergraph={false}
      />

      {/* <TraversalOutputComponentKeyboardOnly
        // nodeGraph={planetsHypergraph}
        nodeGraph={stackedBarChartHypergraph}
        // nodeGraph={topologyHypergraph}
        // nodeGraph={pulleyHypergraph}
        showHypergraph={false}
      /> */}

      <br />
      {/* <TraverseObjRelComponent
        nodeGraph={stackedBarChartNodeMap}
        showGraph={false}
      /> */}
    </>
  );
};

export default App;
