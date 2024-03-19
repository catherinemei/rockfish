import Bluefish from "./bluefish";
import Group from "./group";
import { StackH } from "./stackh";
import Circle from "./circle";
import Text from "./text";
import Ref from "./ref";
import Align from "./align";
import Distribute from "./distribute";
import Rect from "./rect";
import withBluefish from "./withBluefish";
import Line from "./line";
import Path from "./path";

const r = 25;

const w2jut = 10;

const maybeSub = (a?: number, b?: number) =>
  a !== undefined && b !== undefined ? a - b : undefined;

type WeightProps = {
  x?: number;
  y?: number;
  width: number;
  height: number;
  children: string;
  "aria-data"?: any;
};

type PulleyCircleProps = {
  cx?: number;
  cy?: number;
  r?: number;
  "aria-data"?: any;
};

const Weight = withBluefish((props: WeightProps) => {
  return (
    <Align
      alignment="center"
      x={props.x}
      y={props.y}
      aria-data={props["aria-data"] ?? ""}
    >
      <Path
        aria-data={"Weight " + props["aria-data"] ?? ""}
        d={`M 10,0 l ${props.width - 20},0 l 10,${
          props.height
        } l ${-props.width},0 Z`}
      />
      <Text font-size="10" aria-data={"Label " + props["aria-data"] ?? ""}>
        {props.children}
      </Text>
    </Align>
  );
});

const PulleyCircle = withBluefish((props: PulleyCircleProps) => (
  <Align
    alignment="center"
    x={maybeSub(props.cx, props.r ?? 20)}
    y={maybeSub(props.cy, props.r ?? 20)}
  >
    <Circle r={props.r ?? 20} stroke="black" stroke-width={3} fill="none" />
    <Circle r={5} />
  </Align>
));
export const Pulley = () => {
  return (
    <Bluefish aria-data="Bluefish Pulley">
      <Rect
        name="rect"
        height={20}
        width={9 * r}
        stroke="black"
        fill="none"
        stroke-width={3}
        x={0}
        y={0}
        aria-data="Wall"
      />

      <Text name={"Atext"} x={r} y={-r} aria-data="Label A">
        A
      </Text>
      <Text name={"Btext"} x={r} y={-r} aria-data="Label B">
        B
      </Text>
      <Text name={"Ctext"} x={r} y={-r} aria-data="Label C">
        C
      </Text>
      <Text name="t4" aria-data="Label p">
        p
      </Text>
      <Text name="t5" aria-data="Label q">
        q
      </Text>
      <Text name="t6" aria-data="Label s">
        s
      </Text>

      <Text name="t0" y={-10} aria-data="Label t">
        t
      </Text>
      <Text name="t1" aria-data="Label x">
        x
      </Text>

      <Text name="t2" aria-data="Label y">
        y
      </Text>

      <Text name="t3" aria-data="Label z">
        z
      </Text>

      <PulleyCircle name="A" r={r} />
      <PulleyCircle name="B" r={r} />
      <PulleyCircle name="C" r={r} />

      <Distribute
        direction="horizontal"
        spacing={-r}
        aria-data="A-B Horizontal"
      >
        <Ref select="A" />
        <Ref select="B" />
      </Distribute>
      <Distribute direction="horizontal" spacing={0} aria-data="B-C Horizontal">
        <Ref select="B" />
        <Ref select="C" />
      </Distribute>
      <Distribute direction="vertical" spacing={40} aria-data="Wall-B Vertical">
        <Ref select="rect" />
        <Ref select="B" />
      </Distribute>
      <Distribute direction="vertical" spacing={30} aria-data="B-A Vertical">
        <Ref select="B" />
        <Ref select="A" />
      </Distribute>
      <Distribute direction="vertical" spacing={50} aria-data="B-C Vertical">
        <Ref select="B" />
        <Ref select="C" />
      </Distribute>

      <Align alignment="center" aria-data="B-Btext">
        <Ref select="B" />
        <Ref select="Btext" />
      </Align>
      <Align alignment="center" aria-data="A-Atext">
        <Ref select="A" />
        <Ref select="Atext" />
      </Align>
      <Align alignment="center" aria-data="C-Ctext">
        <Ref select="C" />
        <Ref select="Ctext" />
      </Align>

      <Line target={[0.5, 0.5]} name="l0" aria-data="Rope T">
        <Ref select="rect" />
        <Ref select="B" />
      </Line>

      <StackH spacing={5}>
        <Ref select="t0" />
        <Ref select="l0" />
      </StackH>

      <Line target={[1, 0.5]} name="l3">
        <Ref select="rect" />
        <Ref select="C" />
      </Line>
      <Line source={[0, 0.5]} target={[0.5, 0.5]} name="l1">
        <Ref select="B" />
        <Ref select="A" />
      </Line>
      <Line source={[1, 0.5]} target={[0, 0.5]} name="l2">
        <Ref select="B" />
        <Ref select="C" />
      </Line>

      <StackH spacing={5}>
        <Ref select="l1" />
        <Ref select="t1" />
      </StackH>
      <Distribute spacing={5} direction="horizontal">
        <Ref select="l2" />
        <Ref select="t2" />
      </Distribute>
      <Distribute spacing={5} direction="horizontal">
        <Ref select="l3" />
        <Ref select="t3" />
      </Distribute>
      <Align alignment="centerY">
        <Ref select="t1" />
        <Ref select="t2" />
        <Ref select="t3" />
      </Align>

      <StackH name="w1">
        <Weight width={30} height={30} aria-data="W1">
          W1
        </Weight>
        // hack to offset the centerX alignment of A and w1
        <Rect fill="transparent" width={r * 2 - 10} />
      </StackH>
      <StackH name="w2">
        // hack to offset the centerX alignment of A and w2
        <Rect fill="transparent" width={r + (r / 2 - 10) - w2jut / 2} />
        <Weight width={r * 3 + w2jut} height={30} aria-data="W2">
          W2
        </Weight>
      </StackH>
      <Distribute spacing={50} direction="vertical" aria-data="C-W2 Vertical">
        <Ref select="C" />
        <Ref select="w2" />
      </Distribute>
      <Align alignment="left" aria-data="A-W2">
        <Ref select="A" />
        <Ref select="w2" />
      </Align>
      <Align alignment="centerX" aria-data="A-W1">
        <Ref select="A" />
        <Ref select="w1" />
      </Align>
      <Align alignment="centerY" aria-data="W1-W2">
        <Ref select="w1" />
        <Ref select="w2" />
      </Align>

      <Line source={[0, 0.5]} name="l4" aria-data="Rope P">
        <Ref select="A" />
        <Ref select="w1" />
      </Line>
      <Line source={[1, 0.5]} name="l5" aria-data="Rope Q">
        <Ref select="A" />
        <Ref select="w2" />
      </Line>
      <Line source={[0.5, 0.5]} name="l6" aria-data="Rope S">
        <Ref select="C" />
        <Ref select="w2" />
      </Line>

      <Distribute spacing={5} direction="horizontal">
        <Ref select="l4" />
        <Ref select="t4" />
      </Distribute>
      <Distribute spacing={5} direction="horizontal">
        <Ref select="l5" />
        <Ref select="t5" />
      </Distribute>
      <StackH spacing={5}>
        <Ref select="l6" />
        <Ref select="t6" />
      </StackH>
      <Align alignment="centerY">
        <Ref select="t6" />
        <Ref select="t5" />
        <Ref select="t4" />
      </Align>

      <Group name="G">
        <Ref select="A" />
        <Ref select="B" />
        <Ref select="C" />
      </Group>
      <Align alignment="centerX">
        <Ref select="rect" />
        <Ref select="G" />
      </Align>
    </Bluefish>
  );
};

export default Pulley;
