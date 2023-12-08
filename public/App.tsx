// import "solid-devtools";

import { createSignal, type Component, For } from "solid-js";

import { PaperScope, Path, Point, Size } from "paper/dist/paper-core";
import { TraversalComponent, Node } from "../examples/traversal";
import { GraphVisualizer } from "../examples/traversal-target";
import { Bluefish } from "../src/bluefish";
import Background from "../src/background";
import { StackH } from "../src/stackh";
import Circle from "../src/circle";
import Ref from "../src/ref";
import Arrow from "../src/arrow";
import Text from "../src/text";
import { StackV } from "../src/stackv";

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

  return (
    <>
      <Bluefish id="bluefish-planets" padding={20}>
        <StackH spacing={50}>
          <Circle
            name="mercury"
            r={15}
            fill={"#EBE3CF"}
            stroke-width={3}
            stroke={"black"}
          />
          <Circle
            name="venus"
            r={36}
            fill={"#DC933C"}
            stroke-width={3}
            stroke={"black"}
          />
          <Circle
            name="earth"
            r={38}
            fill={"#179DD7"}
            stroke-width={3}
            stroke={"black"}
          />
          <Circle
            name="mars"
            r={21}
            fill={"#F1CF8E"}
            stroke-width={3}
            stroke={"black"}
          />
        </StackH>
        <StackV spacing={60}>
          <Text name="label" vertical-anchor="start" width={500}>
            Mercury
          </Text>
          <Ref select="mercury" />
        </StackV>
        <Background>
          <Ref select="mercury" />
          <Ref select="venus" />
          <Ref select="earth" />
          <Ref select="mars" />
        </Background>
        <Arrow>
          <Ref select="label" />
          <Ref select="mercury" />
        </Arrow>
      </Bluefish>
      <br />
      <GraphVisualizer nodes={planetsTraversalNoAnnotation} />
      <br />
      <TraversalComponent nodes={planetsTraversalNoAnnotation} />
      <br />
    </>
  );
};

export default App;
