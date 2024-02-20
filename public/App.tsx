// import "solid-devtools";

import { createSignal, type Component, For } from "solid-js";

import { PaperScope, Path, Point, Size } from "paper/dist/paper-core";
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
import {
  ObjectNode,
  RelationNode,
  TraverseObjRelComponent,
} from "../examples/traversal-rel-obj";
import {
  PriorityNode,
  TraversePriorityComponent,
} from "../examples/traversal-priority";

const arr = Array.from({ length: 1000 }, (_, i) => i + 1);

const App: Component = () => {
  const planetsTraversalNoAnnotation: Node[] = [
    {
      id: "0",
      parents: [],
      children: ["1"],
      description: "Root SVG",
    },
    {
      id: "1",
      parents: ["0"],
      children: ["2"],
      description: "Background",
    },
    {
      id: "2",
      parents: ["1"],
      children: ["5", "6", "7", "8"],
      description: "StackH",
    },
    {
      id: "5",
      parents: ["2"],
      children: [],
      description: "Circle (mercury)",
    },
    {
      id: "6",
      parents: ["2"],
      children: [],
      description: "Circle (venus)",
    },
    {
      id: "7",
      parents: ["2"],
      children: [],
      description: "Circle (earth)",
    },
    {
      id: "8",
      parents: ["2"],
      children: [],
      description: "Circle (mars)",
    },
  ];

  const planetsTraversal: Node[] = [
    {
      id: "0",
      parents: [],
      children: ["1", "3", "4"],
      description: "Root SVG",
    },
    {
      id: "1",
      parents: ["0"],
      children: ["2"],
      description: "Background",
    },
    {
      id: "2",
      parents: ["1"],
      children: ["5", "6", "7", "8"],
      description: "StackH",
    },
    {
      id: "3",
      parents: ["0"],
      children: ["5", "9"],
      description: "StackV",
    },
    {
      id: "4",
      parents: ["0"],
      children: ["5", "9"],
      description: "Arrow",
    },
    {
      id: "5",
      parents: ["2", "3", "4"],
      children: [],
      description: "Circle (mercury)",
    },
    {
      id: "6",
      parents: ["2"],
      children: [],
      description: "Circle (venus)",
    },
    {
      id: "7",
      parents: ["2"],
      children: [],
      description: "Circle (earth)",
    },
    {
      id: "8",
      parents: ["2"],
      children: [],
      description: "Circle (mars)",
    },
    {
      id: "9",
      parents: ["3", "4"],
      children: [],
      description: "Text (label)",
    },
  ];

  const planetsTraversal2: Node[] = [
    {
      id: "0",
      parents: [],
      children: ["2", "3", "4"],
      description: "Root SVG",
    },
    {
      id: "2",
      parents: ["0"],
      children: ["5", "6", "7", "8"],
      description: "Modifier",
    },
    {
      id: "3",
      parents: ["0"],
      children: ["5", "9"],
      description: "StackV",
    },
    {
      id: "4",
      parents: ["0"],
      children: ["5", "9"],
      description: "Arrow",
    },
    {
      id: "5",
      parents: ["2", "3", "4"],
      children: [],
      description: "Circle (mercury)",
    },
    {
      id: "6",
      parents: ["2"],
      children: [],
      description: "Circle (venus)",
    },
    {
      id: "7",
      parents: ["2"],
      children: [],
      description: "Circle (earth)",
    },
    {
      id: "8",
      parents: ["2"],
      children: [],
      description: "Circle (mars)",
    },
    {
      id: "9",
      parents: ["3", "4"],
      children: [],
      description: "Text (label)",
    },
  ];

  const planetsTraversal3: Node[] = [
    {
      id: "0",
      parents: [],
      children: ["2", "3"],
      description: "Root SVG",
    },
    {
      id: "2",
      parents: ["0"],
      children: ["5", "6", "7", "8"],
      description: "Modifier",
    },
    {
      id: "3",
      parents: ["0"],
      children: ["5", "9"],
      description: "Annotation",
    },
    {
      id: "5",
      parents: ["2", "3"],
      children: [],
      description: "Circle (mercury)",
    },
    {
      id: "6",
      parents: ["2"],
      children: [],
      description: "Circle (venus)",
    },
    {
      id: "7",
      parents: ["2"],
      children: [],
      description: "Circle (earth)",
    },
    {
      id: "8",
      parents: ["2"],
      children: [],
      description: "Circle (mars)",
    },
    {
      id: "9",
      parents: ["3"],
      children: [],
      description: "Text (label)",
    },
  ];

  const planetsTraversal4: Node[] = [
    {
      id: "0",
      parents: [],
      children: ["2", "5"],
      description: "Root SVG",
    },
    {
      id: "2",
      parents: ["0"],
      children: ["5", "6", "7", "8"],
      description: "Modifier",
    },
    {
      id: "5",
      parents: ["2", "3"],
      children: ["9"],
      description: "Circle (mercury)",
    },
    {
      id: "6",
      parents: ["2"],
      children: [],
      description: "Circle (venus)",
    },
    {
      id: "7",
      parents: ["2"],
      children: [],
      description: "Circle (earth)",
    },
    {
      id: "8",
      parents: ["2"],
      children: [],
      description: "Circle (mars)",
    },
    {
      id: "9",
      parents: ["5"],
      children: [],
      description: "Text (label)",
    },
  ];

  const planetsTraversal5: Node[] = [
    {
      id: "0",
      parents: [],
      children: ["2", "5"],
      description: "Root SVG",
    },
    {
      id: "2",
      parents: ["0"],
      children: ["5", "6", "7", "8"],
      description: "Modifier",
    },
    {
      id: "5",
      parents: ["2", "3", "9"],
      children: [],
      description: "Circle (mercury)",
    },
    {
      id: "6",
      parents: ["2"],
      children: [],
      description: "Circle (venus)",
    },
    {
      id: "7",
      parents: ["2"],
      children: [],
      description: "Circle (earth)",
    },
    {
      id: "8",
      parents: ["2"],
      children: [],
      description: "Circle (mars)",
    },
    {
      id: "9",
      parents: [],
      children: ["5"],
      description: "Text (label)",
    },
  ];

  const planetTraversalRelObject: (ObjectNode | RelationNode)[] = [
    {
      id: "0",
      description: "Bluefish",
      parent: "",
      children: ["1", "2"],
      relations: [],
    },
    {
      id: "1",
      description: "Background",
      parent: "0",
      children: ["3"],
      relations: [],
    },
    {
      id: "2",
      description: "Text",
      parent: "0",
      children: [],
      relations: ["8", "9"],
    },
    {
      id: "3",
      description: "StackH",
      parent: "1",
      children: ["4", "5", "6", "7"],
      relations: [],
    },
    {
      id: "4",
      description: "Circle (mercury)",
      parent: "3",
      children: [],
      relations: ["8", "9"],
    },
    {
      id: "5",
      description: "Circle (venus)",
      parent: "3",
      children: [],
      relations: [],
    },
    {
      id: "6",
      description: "Circle (earth)",
      parent: "3",
      children: [],
      relations: [],
    },
    {
      id: "7",
      description: "Circle (mars)",
      parent: "3",
      children: [],
      relations: [],
    },
    {
      id: "8",
      description: "Arrow",
      members: ["2", "4"],
    },
    {
      id: "9",
      description: "StackV",
      members: ["2", "4"],
    },
  ];

  const planetTraversalPriority: PriorityNode[] = [
    {
      id: "0",
      description: "Bluefish",
      relations: [
        { id: "1", priority: "contains/child" },
        { id: "2", priority: "contains/child" },
      ],
    },
    {
      id: "1",
      description: "Background",
      relations: [
        { id: "0", priority: "contained by/parent" },
        { id: "3", priority: "contains/child" },
      ],
    },
    {
      id: "2",
      description: "Text",
      relations: [
        { id: "0", priority: "contained by/parent" },
        { id: "4", priority: "connected" },
        { id: "4", priority: "aligned" },
      ],
    },
    {
      id: "3",
      description: "StackH",
      relations: [
        { id: "1", priority: "contained by/parent" },
        { id: "4", priority: "contains/child" },
        { id: "5", priority: "contains/child" },
        { id: "6", priority: "contains/child" },
        { id: "7", priority: "contains/child" },
      ],
    },
    {
      id: "4",
      description: "Circle (mercury)",
      relations: [
        { id: "3", priority: "contained by/parent" },
        { id: "2", priority: "connected" },
        { id: "2", priority: "aligned" },
      ],
    },
    {
      id: "5",
      description: "Circle (venus)",
      relations: [{ id: "3", priority: "contained by/parent" }],
    },
    {
      id: "6",
      description: "Circle (earth)",
      relations: [{ id: "3", priority: "contained by/parent" }],
    },
    {
      id: "7",
      description: "Circle (mars)",
      relations: [{ id: "3", priority: "contained by/parent" }],
    },
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
  ];

  const pulleyTraversal: (ObjectNode | RelationNode)[] = [
    // {
    //   id: "root",
    //   description: "Bluefish",
    //   parent: "",
    //   children: [
    //     "0",
    //     "1",
    //     "2",
    //     "3",
    //     "4",
    //     "5",
    //     "6",
    //     "7",
    //     "8",
    //     "9",
    //     "10",
    //     "11",
    //     "12",
    //   ],
    //   relations: [],
    // },
    {
      id: "0",
      description: "a: W1",
      parent: "root",
      children: ["13"],
      relations: ["17"],
    },
    {
      id: "1",
      description: "b: RopeP",
      parent: "root",
      children: [],
      relations: ["14", "17"],
    },
    {
      id: "2",
      description: "c: RopeQ",
      parent: "root",
      children: [],
      relations: ["14", "18"],
    },
    {
      id: "3",
      description: "d: PulleyA",
      parent: "root",
      children: [],
      relations: ["14", "19"],
    },
    {
      id: "4",
      description: "e: W2",
      parent: "root",
      children: [],
      relations: ["18", "20"],
    },
    {
      id: "5",
      description: "f: RopeX",
      parent: "root",
      children: [],
      relations: ["15", "19"],
    },
    {
      id: "6",
      description: "g: PulleyB",
      parent: "root",
      children: [],
      relations: ["15", "21"],
    },
    {
      id: "7",
      description: "h: RopeY",
      parent: "root",
      children: [],
      relations: ["15", "16", "22"],
    },
    {
      id: "8",
      description: "i: PulleyC",
      parent: "root",
      children: [],
      relations: ["16", "22", "23", "24"],
    },
    {
      id: "9",
      description: "j: RopeZ",
      parent: "root",
      children: [],
      relations: ["16", "23", "25"],
    },
    {
      id: "10",
      description: "k: RopeT",
      parent: "root",
      children: [],
      relations: ["21", "26"],
    },
    {
      id: "11",
      description: "l: RopeS",
      parent: "root",
      children: [],
      relations: ["20", "24"],
    },
    {
      id: "12",
      description: "m: Wall",
      parent: "root",
      children: [],
      relations: ["25", "26"],
    },
    {
      id: "13",
      description: "W1 label: 1",
      parent: "0",
      children: [],
      relations: [],
    },
    {
      id: "14",
      description: "Pulley-system A",
      // description: "Pulley-system at PulleyA (d)",
      members: ["1", "2", "3"],
    },
    {
      id: "15",
      description: "Pulley-system B",
      // description: "Pulley-system at PulleyB (g)",
      members: ["5", "6", "7"],
    },
    {
      id: "16",
      description: "Pulley-system C",
      // description: "Pulley-system at PulleyC (i)",
      members: ["7", "8", "9"],
    },
    {
      id: "17",
      description: "W1 hangs from RopeP",
      // description: "Weight W1 (a) hangs from RopeP (b)",
      members: ["0", "1"],
    },
    {
      id: "18",
      description: "W2 hangs from RopeQ",
      // description: "Weight W2 (e) hangs from RopeQ (c)",
      members: ["4", "2"],
    },
    {
      id: "19",
      description: "PulleyA \nhangs from \nRopeX",
      // description: "PulleyA (d) hangs from RopeX (f)",
      members: ["3", "5"],
    },
    {
      id: "20",
      description: "W2 hangs from RopeS",
      // description: "Weight W2 (e) hangs from RopeS (l)",
      members: ["4", "11"],
    },
    {
      id: "21",
      description: "PulleyB hangs from RopeT",
      // description: "PulleyB (g) hangs from RopeT (k)",
      members: ["6", "10"],
    },
    {
      id: "22",
      description: "PulleyC hangs from RopeY",
      // description: "PulleyC (i) hangs from RopeY (h)",
      members: ["8", "7"],
    },
    {
      id: "23",
      description: "PulleyC hangs from RopeZ",
      // description: "PulleyC (i) hangs from RopeZ (j)",
      members: ["8", "9"],
    },
    {
      id: "24",
      description: "RopeS hangs from PulleyC",
      // description: "RopeS (l) hangs from PulleyC (i)",
      members: ["11", "8"],
    },
    {
      id: "25",
      description: "RopeZ hangs from Wall",
      // description: "RopeZ (j) hangs from Wall (m)",
      members: ["9", "12"],
    },
    {
      id: "26",
      description: "RopeT hangs from Wall",
      // description: "RopeT (k) hangs from Wall (m)",
      members: ["10", "12"],
    },
  ];

  return (
    <>
      <Bluefish id="bluefish-planets" padding={20} aria-label="Bluefish">
        <Group
          aria-label="Group"
          rels={() => (
            <>
              <StackV spacing={60} aria-label="StackV">
                <Ref select="label" />
                <Ref select="mercury" />
              </StackV>
              <Arrow aria-label="Arrow">
                <Ref select="label" />
                <Ref select="mercury" />
              </Arrow>
            </>
          )}
        >
          <Background aria-label="Background">
            <StackH spacing={50} aria-label="StackH">
              <Circle
                name="mercury"
                r={15}
                fill={"#EBE3CF"}
                stroke-width={3}
                stroke={"black"}
                aria-label="Mercury"
              />
              <Circle
                name="venus"
                r={36}
                fill={"#DC933C"}
                stroke-width={3}
                stroke={"black"}
                aria-label="Venus"
              />
              <Circle
                name="earth"
                r={38}
                fill={"#179DD7"}
                stroke-width={3}
                stroke={"black"}
                aria-label="Earth"
              />
              <Circle
                name="mars"
                r={21}
                fill={"#F1CF8E"}
                stroke-width={3}
                stroke={"black"}
                aria-label="Mars"
              />
            </StackH>
          </Background>
          <Text
            name="label"
            vertical-anchor="start"
            width={500}
            aria-label="Text Label"
          >
            Mercury
          </Text>
        </Group>
      </Bluefish>

      {/* <TraversalComponent visualizeGraph /> */}
      {/* <br /> */}
      {/* <TraverseObjRelComponent nodes={pulleyTraversal} visualizeGraph /> */}
      {/* <br /> */}
      <TraverseObjRelComponent
        nodes={planetTraversalRelObject}
        visualizeGraph
      />
      <br />
      <TraversePriorityComponent nodes={planetTraversalPriority} />
    </>
  );
};

export default App;
