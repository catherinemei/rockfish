// import "solid-devtools";

import { createSignal, type Component, For } from "solid-js";

import { TraversalComponent, Node } from "../examples/traversal";
import { Bluefish } from "../src/bluefish";
import Background from "../src/background";
import { StackH } from "../src/stackh";
import Circle from "../src/circle";
import Ref from "../src/ref";
import Arrow from "../src/arrow";
import Text from "../src/text";
import { StackV } from "../src/stackv";
import Group from "../src/group";
// import {
//   ObjectNode,
//   RelationNode,
//   TraverseObjRelComponent,
// } from "../examples/traversal-rel-obj";
// import {
//   PriorityNode,
//   TraversePriorityComponent,
// } from "../examples/traversal-priority";
import { Pulley } from "../src/pulley";
import {
  RelationNode,
  Hypergraph,
  TraversalOutputProps,
  TraversalOutputComponent,
} from "../examples/priority-traversal";

const arr = Array.from({ length: 1000 }, (_, i) => i + 1);

const App: Component = () => {
  // const planetsTraversalNoAnnotation: Node[] = [
  //   {
  //     id: "0",
  //     parents: [],
  //     children: ["1"],
  //     description: "Root SVG",
  //   },
  //   {
  //     id: "1",
  //     parents: ["0"],
  //     children: ["2"],
  //     description: "Background",
  //   },
  //   {
  //     id: "2",
  //     parents: ["1"],
  //     children: ["5", "6", "7", "8"],
  //     description: "StackH",
  //   },
  //   {
  //     id: "5",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (mercury)",
  //   },
  //   {
  //     id: "6",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (venus)",
  //   },
  //   {
  //     id: "7",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (earth)",
  //   },
  //   {
  //     id: "8",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (mars)",
  //   },
  // ];

  // const planetsTraversal: Node[] = [
  //   {
  //     id: "0",
  //     parents: [],
  //     children: ["1", "3", "4"],
  //     description: "Root SVG",
  //   },
  //   {
  //     id: "1",
  //     parents: ["0"],
  //     children: ["2"],
  //     description: "Background",
  //   },
  //   {
  //     id: "2",
  //     parents: ["1"],
  //     children: ["5", "6", "7", "8"],
  //     description: "StackH",
  //   },
  //   {
  //     id: "3",
  //     parents: ["0"],
  //     children: ["5", "9"],
  //     description: "StackV",
  //   },
  //   {
  //     id: "4",
  //     parents: ["0"],
  //     children: ["5", "9"],
  //     description: "Arrow",
  //   },
  //   {
  //     id: "5",
  //     parents: ["2", "3", "4"],
  //     children: [],
  //     description: "Circle (mercury)",
  //   },
  //   {
  //     id: "6",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (venus)",
  //   },
  //   {
  //     id: "7",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (earth)",
  //   },
  //   {
  //     id: "8",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (mars)",
  //   },
  //   {
  //     id: "9",
  //     parents: ["3", "4"],
  //     children: [],
  //     description: "Text (label)",
  //   },
  // ];

  // const planetsTraversal2: Node[] = [
  //   {
  //     id: "0",
  //     parents: [],
  //     children: ["2", "3", "4"],
  //     description: "Root SVG",
  //   },
  //   {
  //     id: "2",
  //     parents: ["0"],
  //     children: ["5", "6", "7", "8"],
  //     description: "Modifier",
  //   },
  //   {
  //     id: "3",
  //     parents: ["0"],
  //     children: ["5", "9"],
  //     description: "StackV",
  //   },
  //   {
  //     id: "4",
  //     parents: ["0"],
  //     children: ["5", "9"],
  //     description: "Arrow",
  //   },
  //   {
  //     id: "5",
  //     parents: ["2", "3", "4"],
  //     children: [],
  //     description: "Circle (mercury)",
  //   },
  //   {
  //     id: "6",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (venus)",
  //   },
  //   {
  //     id: "7",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (earth)",
  //   },
  //   {
  //     id: "8",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (mars)",
  //   },
  //   {
  //     id: "9",
  //     parents: ["3", "4"],
  //     children: [],
  //     description: "Text (label)",
  //   },
  // ];

  // const planetsTraversal3: Node[] = [
  //   {
  //     id: "0",
  //     parents: [],
  //     children: ["2", "3"],
  //     description: "Root SVG",
  //   },
  //   {
  //     id: "2",
  //     parents: ["0"],
  //     children: ["5", "6", "7", "8"],
  //     description: "Modifier",
  //   },
  //   {
  //     id: "3",
  //     parents: ["0"],
  //     children: ["5", "9"],
  //     description: "Annotation",
  //   },
  //   {
  //     id: "5",
  //     parents: ["2", "3"],
  //     children: [],
  //     description: "Circle (mercury)",
  //   },
  //   {
  //     id: "6",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (venus)",
  //   },
  //   {
  //     id: "7",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (earth)",
  //   },
  //   {
  //     id: "8",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (mars)",
  //   },
  //   {
  //     id: "9",
  //     parents: ["3"],
  //     children: [],
  //     description: "Text (label)",
  //   },
  // ];

  // const planetsTraversal4: Node[] = [
  //   {
  //     id: "0",
  //     parents: [],
  //     children: ["2", "5"],
  //     description: "Root SVG",
  //   },
  //   {
  //     id: "2",
  //     parents: ["0"],
  //     children: ["5", "6", "7", "8"],
  //     description: "Modifier",
  //   },
  //   {
  //     id: "5",
  //     parents: ["2", "3"],
  //     children: ["9"],
  //     description: "Circle (mercury)",
  //   },
  //   {
  //     id: "6",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (venus)",
  //   },
  //   {
  //     id: "7",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (earth)",
  //   },
  //   {
  //     id: "8",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (mars)",
  //   },
  //   {
  //     id: "9",
  //     parents: ["5"],
  //     children: [],
  //     description: "Text (label)",
  //   },
  // ];

  // const planetsTraversal5: Node[] = [
  //   {
  //     id: "0",
  //     parents: [],
  //     children: ["2", "5"],
  //     description: "Root SVG",
  //   },
  //   {
  //     id: "2",
  //     parents: ["0"],
  //     children: ["5", "6", "7", "8"],
  //     description: "Modifier",
  //   },
  //   {
  //     id: "5",
  //     parents: ["2", "3", "9"],
  //     children: [],
  //     description: "Circle (mercury)",
  //   },
  //   {
  //     id: "6",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (venus)",
  //   },
  //   {
  //     id: "7",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (earth)",
  //   },
  //   {
  //     id: "8",
  //     parents: ["2"],
  //     children: [],
  //     description: "Circle (mars)",
  //   },
  //   {
  //     id: "9",
  //     parents: [],
  //     children: ["5"],
  //     description: "Text (label)",
  //   },
  // ];

  // const planetTraversalRelObject: (ObjectNode | RelationNode)[] = [
  //   {
  //     id: "0",
  //     description: "Bluefish",
  //     parent: "",
  //     children: ["1", "2"],
  //     relations: [],
  //   },
  //   {
  //     id: "1",
  //     description: "Background",
  //     parent: "0",
  //     children: ["3"],
  //     relations: [],
  //   },
  //   {
  //     id: "2",
  //     description: "Text",
  //     parent: "0",
  //     children: [],
  //     relations: ["8", "9"],
  //   },
  //   {
  //     id: "3",
  //     description: "StackH",
  //     parent: "1",
  //     children: ["4", "5", "6", "7"],
  //     relations: [],
  //   },
  //   {
  //     id: "4",
  //     description: "Circle (mercury)",
  //     parent: "3",
  //     children: [],
  //     relations: ["8", "9"],
  //   },
  //   {
  //     id: "5",
  //     description: "Circle (venus)",
  //     parent: "3",
  //     children: [],
  //     relations: [],
  //   },
  //   {
  //     id: "6",
  //     description: "Circle (earth)",
  //     parent: "3",
  //     children: [],
  //     relations: [],
  //   },
  //   {
  //     id: "7",
  //     description: "Circle (mars)",
  //     parent: "3",
  //     children: [],
  //     relations: [],
  //   },
  //   {
  //     id: "8",
  //     description: "Arrow",
  //     members: ["2", "4"],
  //   },
  //   {
  //     id: "9",
  //     description: "StackV",
  //     members: ["2", "4"],
  //   },
  // ];

  // const planetTraversalPriority: PriorityNode[] = [
  //   {
  //     id: "0",
  //     displayName: "Bluefish",
  //     relations: [
  //       {
  //         relatedNodeId: "1",
  //         relationDisplayName: "Contains (child)",
  //         relationId: "rel0",
  //       },
  //       {
  //         relatedNodeId: "2",
  //         relationDisplayName: "Contains (child)",
  //         relationId: "rel1",
  //       },
  //     ],
  //   },
  //   {
  //     id: "1",
  //     displayName: "Background",
  //     relations: [
  //       {
  //         relatedNodeId: "0",
  //         relationDisplayName: "Contained by (parent)",
  //         relationId: "rel2",
  //       },
  //       {
  //         relatedNodeId: "3",
  //         relationDisplayName: "Contains (child)",
  //         relationId: "rel3",
  //       },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     displayName: "Text",
  //     relations: [
  //       {
  //         relatedNodeId: "0",
  //         relationDisplayName: "Contained by (parent)",
  //         relationId: "rel4",
  //       },
  //       {
  //         relatedNodeId: "4",
  //         relationDisplayName: "Connected",
  //         relationId: "rel5",
  //       },
  //       {
  //         relatedNodeId: "4",
  //         relationDisplayName: "Aligned",
  //         relationId: "rel6",
  //       },
  //     ],
  //   },
  //   {
  //     id: "3",
  //     displayName: "StackH",
  //     relations: [
  //       {
  //         relatedNodeId: "1",
  //         relationDisplayName: "Contained by (parent)",
  //         relationId: "rel7",
  //       },
  //       {
  //         relatedNodeId: "4",
  //         relationDisplayName: "Contains (child)",
  //         relationId: "rel8",
  //       },
  //       {
  //         relatedNodeId: "5",
  //         relationDisplayName: "Contains (child)",
  //         relationId: "rel9",
  //       },
  //       {
  //         relatedNodeId: "6",
  //         relationDisplayName: "Contains (child)",
  //         relationId: "rel10",
  //       },
  //       {
  //         relatedNodeId: "7",
  //         relationDisplayName: "Contains (child)",
  //         relationId: "rel11",
  //       },
  //     ],
  //   },
  //   {
  //     id: "4",
  //     displayName: "Circle (mercury)",
  //     relations: [
  //       {
  //         relatedNodeId: "3",
  //         relationDisplayName: "Contained by (parent)",
  //         relationId: "rel12",
  //       },
  //       {
  //         relatedNodeId: "2",
  //         relationDisplayName: "Connected",
  //         relationId: "rel13",
  //       },
  //       {
  //         relatedNodeId: "2",
  //         relationDisplayName: "Aligned",
  //         relationId: "rel14",
  //       },
  //     ],
  //   },
  //   {
  //     id: "5",
  //     displayName: "Circle (venus)",
  //     relations: [
  //       {
  //         relatedNodeId: "3",
  //         relationDisplayName: "Contained by (parent)",
  //         relationId: "rel15",
  //       },
  //     ],
  //   },
  //   {
  //     id: "6",
  //     displayName: "Circle (earth)",
  //     relations: [
  //       {
  //         relatedNodeId: "3",
  //         relationDisplayName: "Contained by (parent)",
  //         relationId: "rel16",
  //       },
  //     ],
  //   },
  //   {
  //     id: "7",
  //     displayName: "Circle (mars)",
  //     relations: [
  //       {
  //         relatedNodeId: "3",
  //         relationDisplayName: "Contained by (parent)",
  //         relationId: "rel17",
  //       },
  //     ],
  //   },
  // {
  //   id: "8",
  //   description: "Arrow",
  //   relations: [
  //     { id: "2", priority: "related" },
  //     { id: "4", priority: "related" },
  //   ],
  // },
  // {
  //   id: "9",
  //   description: "StackV",
  //   relations: [
  //     { id: "2", priority: "related" },
  //     { id: "4", priority: "related" },
  //   ],
  // },
  // ];

  // const pulleyTraversal: (ObjectNode | RelationNode)[] = [
  //   // {
  //   //   id: "root",
  //   //   description: "Bluefish",
  //   //   parent: "",
  //   //   children: [
  //   //     "0",
  //   //     "1",
  //   //     "2",
  //   //     "3",
  //   //     "4",
  //   //     "5",
  //   //     "6",
  //   //     "7",
  //   //     "8",
  //   //     "9",
  //   //     "10",
  //   //     "11",
  //   //     "12",
  //   //   ],
  //   //   relations: [],
  //   // },
  //   {
  //     id: "0",
  //     description: "a: W1",
  //     parent: "root",
  //     children: ["13"],
  //     relations: ["17"],
  //   },
  //   {
  //     id: "1",
  //     description: "b: RopeP",
  //     parent: "root",
  //     children: [],
  //     relations: ["14", "17"],
  //   },
  //   {
  //     id: "2",
  //     description: "c: RopeQ",
  //     parent: "root",
  //     children: [],
  //     relations: ["14", "18"],
  //   },
  //   {
  //     id: "3",
  //     description: "d: PulleyA",
  //     parent: "root",
  //     children: [],
  //     relations: ["14", "19"],
  //   },
  //   {
  //     id: "4",
  //     description: "e: W2",
  //     parent: "root",
  //     children: [],
  //     relations: ["18", "20"],
  //   },
  //   {
  //     id: "5",
  //     description: "f: RopeX",
  //     parent: "root",
  //     children: [],
  //     relations: ["15", "19"],
  //   },
  //   {
  //     id: "6",
  //     description: "g: PulleyB",
  //     parent: "root",
  //     children: [],
  //     relations: ["15", "21"],
  //   },
  //   {
  //     id: "7",
  //     description: "h: RopeY",
  //     parent: "root",
  //     children: [],
  //     relations: ["15", "16", "22"],
  //   },
  //   {
  //     id: "8",
  //     description: "i: PulleyC",
  //     parent: "root",
  //     children: [],
  //     relations: ["16", "22", "23", "24"],
  //   },
  //   {
  //     id: "9",
  //     description: "j: RopeZ",
  //     parent: "root",
  //     children: [],
  //     relations: ["16", "23", "25"],
  //   },
  //   {
  //     id: "10",
  //     description: "k: RopeT",
  //     parent: "root",
  //     children: [],
  //     relations: ["21", "26"],
  //   },
  //   {
  //     id: "11",
  //     description: "l: RopeS",
  //     parent: "root",
  //     children: [],
  //     relations: ["20", "24"],
  //   },
  //   {
  //     id: "12",
  //     description: "m: Wall",
  //     parent: "root",
  //     children: [],
  //     relations: ["25", "26"],
  //   },
  //   {
  //     id: "13",
  //     description: "W1 label: 1",
  //     parent: "0",
  //     children: [],
  //     relations: [],
  //   },
  //   {
  //     id: "14",
  //     description: "Pulley-system A",
  //     // description: "Pulley-system at PulleyA (d)",
  //     members: ["1", "2", "3"],
  //   },
  //   {
  //     id: "15",
  //     description: "Pulley-system B",
  //     // description: "Pulley-system at PulleyB (g)",
  //     members: ["5", "6", "7"],
  //   },
  //   {
  //     id: "16",
  //     description: "Pulley-system C",
  //     // description: "Pulley-system at PulleyC (i)",
  //     members: ["7", "8", "9"],
  //   },
  //   {
  //     id: "17",
  //     description: "W1 hangs from RopeP",
  //     // description: "Weight W1 (a) hangs from RopeP (b)",
  //     members: ["0", "1"],
  //   },
  //   {
  //     id: "18",
  //     description: "W2 hangs from RopeQ",
  //     // description: "Weight W2 (e) hangs from RopeQ (c)",
  //     members: ["4", "2"],
  //   },
  //   {
  //     id: "19",
  //     description: "PulleyA hangs from RopeX",
  //     // description: "PulleyA (d) hangs from RopeX (f)",
  //     members: ["3", "5"],
  //   },
  //   {
  //     id: "20",
  //     description: "W2 hangs from RopeS",
  //     // description: "Weight W2 (e) hangs from RopeS (l)",
  //     members: ["4", "11"],
  //   },
  //   {
  //     id: "21",
  //     description: "PulleyB hangs from RopeT",
  //     // description: "PulleyB (g) hangs from RopeT (k)",
  //     members: ["6", "10"],
  //   },
  //   {
  //     id: "22",
  //     description: "PulleyC hangs from RopeY",
  //     // description: "PulleyC (i) hangs from RopeY (h)",
  //     members: ["8", "7"],
  //   },
  //   {
  //     id: "23",
  //     description: "PulleyC hangs from RopeZ",
  //     // description: "PulleyC (i) hangs from RopeZ (j)",
  //     members: ["8", "9"],
  //   },
  //   {
  //     id: "24",
  //     description: "RopeS hangs from PulleyC",
  //     // description: "RopeS (l) hangs from PulleyC (i)",
  //     members: ["11", "8"],
  //   },
  //   {
  //     id: "25",
  //     description: "RopeZ hangs from Wall",
  //     // description: "RopeZ (j) hangs from Wall (m)",
  //     members: ["9", "12"],
  //   },
  //   {
  //     id: "26",
  //     description: "RopeT hangs from Wall",
  //     // description: "RopeT (k) hangs from Wall (m)",
  //     members: ["10", "12"],
  //   },
  // ];

  // const pulleyTraversalPriority: PriorityNode[] = [
  //   {
  //     id: "0",
  //     displayName: "a: W1",
  //     relations: [
  //       { relatedNodeId: "13", relationDisplayName: "Contains (child)" },
  //       { relatedNodeId: "1", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "1",
  //     displayName: "b: RopeP",
  //     relations: [
  //       { relatedNodeId: "2", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "3", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "0", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "2",
  //     displayName: "c: RopeQ",
  //     relations: [
  //       { relatedNodeId: "1", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "3", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "4", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "3",
  //     displayName: "d: PulleyA",
  //     relations: [
  //       { relatedNodeId: "1", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "2", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "5", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "4",
  //     displayName: "e: W2",
  //     relations: [
  //       { relatedNodeId: "2", relationDisplayName: "Hangs from" },
  //       { relatedNodeId: "11", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "5",
  //     displayName: "f: RopeX",
  //     relations: [
  //       { relatedNodeId: "6", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "7", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "3", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "6",
  //     displayName: "g: PulleyB",
  //     relations: [
  //       { relatedNodeId: "5", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "7", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "10", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "7",
  //     displayName: "h: RopeY",
  //     relations: [
  //       { relatedNodeId: "5", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "6", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "8", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "9", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "8", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "8",
  //     displayName: "i: PulleyC",
  //     relations: [
  //       { relatedNodeId: "7", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "9", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "7", relationDisplayName: "Hangs from" },
  //       { relatedNodeId: "9", relationDisplayName: "Hangs from" },
  //       { relatedNodeId: "11", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "9",
  //     displayName: "j: RopeZ",
  //     relations: [
  //       { relatedNodeId: "7", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "8", relationDisplayName: "Pulley System" },
  //       { relatedNodeId: "8", relationDisplayName: "Hangs from" },
  //       { relatedNodeId: "12", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "10",
  //     displayName: "k: RopeT",
  //     relations: [
  //       { relatedNodeId: "6", relationDisplayName: "Hangs from" },
  //       { relatedNodeId: "12", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "11",
  //     displayName: "l: RopeS",
  //     relations: [
  //       { relatedNodeId: "4", relationDisplayName: "Hangs from" },
  //       { relatedNodeId: "8", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "12",
  //     displayName: "m: Wall",
  //     relations: [
  //       { relatedNodeId: "9", relationDisplayName: "Hangs from" },
  //       { relatedNodeId: "10", relationDisplayName: "Hangs from" },
  //     ],
  //   },
  //   {
  //     id: "13",
  //     displayName: "W1 label: 1",
  //     relations: [
  //       { relatedNodeId: "0", relationDisplayName: "Contained by (parent)" },
  //     ],
  //   },
  // ];

  // id: Id;
  // displayName: string;
  // description?: string;
  // parents: Id[];
  // children: Id[];
  // priority: number;

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
      parents: [],
      children: ["1", "2", "22"],
      priority: 0,
    },
    "1": {
      id: "1",
      displayName: "X-axis",
      description: "X Axis. Arsenal, Chelsea, Liverpool, Manchester United.",
      parents: ["0"],
      children: ["3", "4", "5", "6"],
      priority: 1,
    },
    "2": {
      id: "2",
      displayName: "Legend",
      description: "Legend. Contest included: BPL, FA Cup, CL.",
      parents: ["0"],
      children: ["7", "8", "9"],
      priority: 2,
    },
    "3": {
      id: "3",
      displayName: "Arsenal",
      description:
        "Team: Arsenal. Total trophies: 17. Contains: 3 contests. Bar representing the number of trophies won by Arsenal.",
      parents: ["1"],
      children: ["10", "11", "12"],
      priority: 2,
    },
    "4": {
      id: "4",
      displayName: "Chelsea",
      description:
        "Team: Chelsea. Total trophies: 15. Contains: 3 contests. Bar representing the number of trophies won by Chelsea.",
      parents: ["1"],
      children: ["13", "14", "15"],
      priority: 2,
    },
    "5": {
      id: "5",
      displayName: "Liverpool",
      description:
        "Team: Liverpool. Total trophies: 15. Contains: 3 contests. Bar representing the number of trophies won by Liverpool",
      parents: ["1"],
      children: ["16", "17", "18"],
      priority: 2,
    },
    "6": {
      id: "6",
      displayName: "Manchester",
      description:
        "Team: Manchester United. Total trophies: 28. Contains: 3 contests. Bar representing the number of trophies won by Manchester United.",
      parents: ["1"],
      children: ["19", "20", "21"],
      priority: 2,
    },
    "7": {
      id: "7",
      displayName: "BLP",
      description:
        "Contest: BLP. Total trophies: 22. Contains: 4 teams. Legend grouping for the BLP competition.",
      parents: ["2"],
      children: ["10", "13", "16", "19"],
      priority: 3,
    },
    "8": {
      id: "8",
      displayName: "FA Cup",
      description:
        "Contest: FA Cup. Total trophies: 42. Contains: 4 teams. Legend grouping for the FA Cup competition.",
      parents: ["2"],
      children: ["11", "14", "17", "20"],
      priority: 3,
    },
    "9": {
      id: "9",
      displayName: "CL",
      description:
        "Contest: CL. Total trophies: 11. Contains: 4 teams. Legend grouping for the CL competition.",
      parents: ["2"],
      children: ["12", "15", "18", "21"],
      priority: 3,
    },
    "10": {
      id: "10",
      displayName: "Arsenal BLP",
      description: "Team: Arsenal. Contest: BPL. Trophies: 3. Data point.",
      parents: ["3", "7"],
      children: [],
      priority: 4,
    },
    "11": {
      id: "11",
      displayName: "Arsenal FA Cup",
      description: "Team: Arsenal. Contest: FA Cup. Trophies: 14. Data point.",
      parents: ["3", "8"],
      children: [],
      priority: 4,
    },
    "12": {
      id: "12",
      displayName: "Arsenal CL",
      description: "Team: Arsenal. Contest: CL. Trophies: 0. Data point.",
      parents: ["3", "9"],
      children: [],
      priority: 4,
    },
    "13": {
      id: "13",
      displayName: "Chelsea BLP",
      description: "Team: Chelsea. Contest: BPL. Trophies: 5. Data point.",
      parents: ["4", "7"],
      children: [],
      priority: 4,
    },
    "14": {
      id: "14",
      displayName: "Chelsea FA Cup",
      description: "Team: Chelsea. Contest: FA Cup. Trophies: 8. Data point.",
      parents: ["4", "8"],
      children: [],
      priority: 4,
    },
    "15": {
      id: "15",
      displayName: "Chelsea CL",
      description: "Team: Chelsea. Contest: CL. Trophies: 2. Data point.",
      parents: ["4", "9"],
      children: [],
      priority: 4,
    },
    "16": {
      id: "16",
      displayName: "Liverpool BLP",
      description: "Team: Liverpool. Contest: BPL. Trophies: 1. Data point.",
      parents: ["5", "7"],
      children: [],
      priority: 4,
    },
    "17": {
      id: "17",
      displayName: "Liverpool FA Cup",
      description: "Team: Liverpool. Contest: FA Cup. Trophies: 8. Data point.",
      parents: ["5", "8"],
      children: [],
      priority: 4,
    },
    "18": {
      id: "18",
      displayName: "Liverpool CL",
      description: "Team: Liverpool. Contest: CL. Trophies: 6. Data point.",
      parents: ["5", "9"],
      children: [],
      priority: 4,
    },
    "19": {
      id: "19",
      displayName: "Manchester BLP",
      description:
        "Team: Manchester United. Contest: BLP. Trophies: 13. Data point.",
      parents: ["6", "7"],
      children: [],
      priority: 4,
    },
    "20": {
      id: "20",
      displayName: "Manchester FA Cup",
      description:
        "Team: Manchester United. Contest: FA Cup. Trophies: 12. Data point.",
      parents: ["6", "8"],
      children: [],
      priority: 4,
    },
    "21": {
      id: "21",
      displayName: "Manchester United CL",
      description:
        "Team: Manchester United. Contest: CL. Trophies: 3. Data point.",
      parents: ["6", "9"],
      children: [],
      priority: 4,
    },
    "22": {
      id: "22",
      displayName: "Y-axis",
      description:
        "Y-axis. Label: count trophies. Values range from 0 to 30 on a numerical scale.",
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
        showHypergraph={true}
      />
    </>
  );
};

export default App;
