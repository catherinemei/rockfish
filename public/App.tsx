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
  const [x, setX] = createSignal(0);
  const wordArr = () => Array.from({ length: x() }, (_) => "Mercury");
  const words = () => wordArr().join(" ");

  const [horizontalAlignment, setHorizontalAlignment] = createSignal("centerX");

  const [verticalAlignment, setVerticalAlignment] = createSignal("centerY");

  const [alignment, setAlignment] = createSignal("center");

  const canvas = document.createElement("canvas");
  const paperScope = new PaperScope();
  paperScope.setup(canvas);
  const dims = {
    x: 50,
    y: 25,
    width: 200,
    height: 100,
  };
  const myPath = new Path.Rectangle(
    new Point(dims.x, dims.y),
    new Size(dims.width, dims.height)
  );
  // const myPath = new Path();
  // myPath.add(new Point(50, 75));
  // myPath.add(new Point(50, 25));
  // myPath.add(new Point(150, 25));
  // myPath.add(new Point(150, 75));
  myPath.insert(
    4,
    new Point(
      dims.x + dims.width / 2,
      dims.y + dims.height - (dims.height * 5) / 50
    )
  );

  const dims2 = {
    x: 50,
    y: 50,
    width: 100,
    height: 50,
  };
  const myPath2 = new Path.Rectangle(
    new Point(dims2.x, dims2.y),
    new Size(dims2.width, dims2.height)
  );
  myPath2.insert(
    2,
    new Point(dims2.x + dims2.width / 2, dims2.y + (dims2.height * 5) / 50)
  );
  myPath2.insert(
    5,
    new Point(
      dims2.x + dims2.width / 2,
      dims2.y + dims2.height - (dims2.height * 5) / 50
    )
  );

  const planetsTraversal: Node[] = [
    {
      id: "0",
      parents: [],
      children: ["1", "3"],
      description: "Root SVG (0)",
    },
    {
      id: "1",
      parents: ["0"],
      children: ["2"],
      description: "Background (1)",
    },
    {
      id: "2",
      parents: ["1"],
      children: ["4", "5", "6", "7"],
      description: "Planets Row (2)",
    },
    {
      id: "3",
      parents: ["0"],
      children: ["4", "8", "9"],
      description: "Annotation Col (3)",
    },

    {
      id: "4",
      parents: ["2", "3"],
      children: [],
      description: "Mercury (4)",
    },
    {
      id: "5",
      parents: ["2"],
      children: [],
      description: "Venus (5)",
    },
    {
      id: "6",
      parents: ["2"],
      children: [],
      description: "Earth (6)",
    },
    {
      id: "7",
      parents: ["2"],
      children: [],
      description: "Mars (7)",
    },
    {
      id: "8",
      parents: ["3"],
      children: [],
      description: "Mercury Label (8)",
    },
    {
      id: "9",
      parents: ["3"],
      children: [],
      description: "Arrow (9)",
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
      <GraphVisualizer nodes={planetsTraversal} />
      <br />
      <TraversalComponent nodes={planetsTraversal} />
      <br />
    </>
  );
};

export default App;
