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
      description: "14: Pulley-system",
      // description: "Pulley-system at PulleyA (d)",
      members: ["1", "2", "3"],
    },
    {
      id: "15",
      description: "15: Pulley-system",
      // description: "Pulley-system at PulleyB (g)",
      members: ["5", "6", "7"],
    },
    {
      id: "16",
      description: "16: Pulley-system",
      // description: "Pulley-system at PulleyC (i)",
      members: ["7", "8", "9"],
    },
    {
      id: "17",
      description: "17: Hangs from",
      // description: "Weight W1 (a) hangs from RopeP (b)",
      members: ["0", "1"],
    },
    {
      id: "18",
      description: "18: Hangs from",
      // description: "Weight W2 (e) hangs from RopeQ (c)",
      members: ["4", "2"],
    },
    {
      id: "19",
      description: "19: Hangs from",
      // description: "PulleyA (d) hangs from RopeX (f)",
      members: ["3", "5"],
    },
    {
      id: "20",
      description: "20: Hangs from",
      // description: "Weight W2 (e) hangs from RopeS (l)",
      members: ["4", "11"],
    },
    {
      id: "21",
      description: "21: Hangs from",
      // description: "PulleyB (g) hangs from RopeT (k)",
      members: ["6", "10"],
    },
    {
      id: "22",
      description: "22: Hangs from",
      // description: "PulleyC (i) hangs from RopeY (h)",
      members: ["8", "7"],
    },
    {
      id: "23",
      description: "23: Hangs from",
      // description: "PulleyC (i) hangs from RopeZ (j)",
      members: ["8", "9"],
    },
    {
      id: "24",
      description: "24: Hangs from",
      // description: "RopeS (l) hangs from PulleyC (i)",
      members: ["11", "8"],
    },
    {
      id: "25",
      description: "25: Hangs from",
      // description: "RopeZ (j) hangs from Wall (m)",
      members: ["9", "12"],
    },
    {
      id: "26",
      description: "26: Hangs from",
      // description: "RopeT (k) hangs from Wall (m)",
      members: ["10", "12"],
    },
  ];

  return (
    <>
      {/* <Bluefish id="bluefish-planets" padding={20} aria-label="Bluefish">
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
      </Bluefish> */}

      {/* <TraversalComponent visualizeGraph /> */}
      <br />
      <TraverseObjRelComponent nodes={pulleyTraversal} visualizeGraph />
    </>
  );
};

export default App;
