import {
  JSX,
  ParentProps,
  Show,
  createEffect,
  mergeProps,
  untrack,
} from "solid-js";
import Layout from "./layout";
import withBluefish from "./withBluefish";
import { BBox, Id, Transform, useScenegraph, ChildNode } from "./scenegraph";
import _, { get, startsWith } from "lodash";

type LineProps = {
  name: string;
  stroke?: string;
  strokeWidth?: number;
  source?: [number, number];
  target?: [number, number];
  x?: number;
  y?: number;
  children?: JSX.Element;
  "aria-data"?: any;
};

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);
const lerp = (num: number, min: number, max: number) => min + (max - min) * num;

const maybeLerp = (
  c: number | undefined,
  a: number | undefined,
  b: number | undefined
) =>
  a !== undefined && b !== undefined && c !== undefined
    ? lerp(c, a, b)
    : undefined;
const maybeClamp = (
  c: number | undefined,
  a: number | undefined,
  b: number | undefined
) =>
  a !== undefined && b !== undefined && c !== undefined
    ? clamp(c, a, b)
    : undefined;
const maybeSub = (a: number | undefined, b: number | undefined) =>
  a !== undefined && b !== undefined ? a - b : undefined;
const maybeMin = (a: number | undefined, b: number | undefined) =>
  a !== undefined && b !== undefined ? Math.min(a, b) : undefined;
const maybeMax = (a: number | undefined, b: number | undefined) =>
  a !== undefined && b !== undefined ? Math.max(a, b) : undefined;

export const Line = withBluefish(
  (props: LineProps) => {
    props = mergeProps(
      {
        strokeWidth: 3,
        stroke: "black",
        source: undefined,
        target: undefined,
      },
      props
    );

    const layout = (childIds: ChildNode[]) => {
      childIds = Array.from(childIds);

      const fromBBox = childIds[0].bbox;
      const toBBox = childIds[1].bbox;

      const data = {
        fromX: fromBBox.left ?? 0 + (fromBBox.width ?? 0) / 2,
        fromY: fromBBox.top ?? 0 + (fromBBox.height ?? 0) / 2,
        toX: toBBox.left ?? 0 + (toBBox.width ?? 0) / 2,
        toY: toBBox.top ?? 0 + (toBBox.height ?? 0) / 2,
      };

      let customData: {
        fromX: any;
        fromY: any;
        toX: any;
        toY: any;
        "aria-data"?: any;
      } = { fromX: 0, fromY: 0, toX: 0, toY: 0 };
      if (props.source && props.target) {
        customData = {
          fromX: maybeLerp(props.source[0], fromBBox.left, fromBBox.right),
          fromY: maybeLerp(props.source[1], fromBBox.top, fromBBox.bottom),
          toX: maybeLerp(props.target[0], toBBox.left, toBBox.right),
          toY: maybeLerp(props.target[1], toBBox.top, toBBox.bottom),
          "aria-data": props["aria-data"],
        };
      } else if (props.source) {
        const fromX = maybeLerp(props.source[0], fromBBox.left, fromBBox.right);
        const fromY = maybeLerp(props.source[1], fromBBox.top, fromBBox.bottom);
        customData = {
          fromX,
          fromY,
          toX: maybeClamp(fromX, toBBox.left, toBBox.right),
          toY: maybeClamp(fromY, toBBox.top, toBBox.bottom),
          "aria-data": props["aria-data"],
        };
      } else if (props.target) {
        const toX = maybeLerp(props.target[0], toBBox.left, toBBox.right);
        const toY = maybeLerp(props.target[1], toBBox.top, toBBox.bottom);
        customData = {
          fromX: maybeClamp(toX, fromBBox.left, fromBBox.right),
          fromY: maybeClamp(toY, fromBBox.top, fromBBox.bottom),
          toX,
          toY,
          "aria-data": props["aria-data"],
        };
      } else {
        customData = {
          fromX: maybeLerp(0.5, fromBBox.left, fromBBox.right),
          fromY: maybeLerp(0.5, fromBBox.top, fromBBox.bottom),
          toX: maybeLerp(0.5, toBBox.left, toBBox.right),
          toY: maybeLerp(0.5, toBBox.top, toBBox.bottom),
          "aria-data": props["aria-data"],
        };
      }

      const left = maybeMin(customData.fromX, customData.toX);
      const top = maybeMin(customData.fromY, customData.toY);
      const right = maybeMax(customData.fromX, customData.toX);
      const bottom = maybeMax(customData.fromY, customData.toY);
      const width = maybeSub(right, left);
      const height = maybeSub(bottom, top);

      return {
        transform: {
          translate: {
            x: maybeSub(props.x, left),
            y: maybeSub(props.y, top),
          },
        },
        bbox: { left, top, right, bottom, width, height },
        customData,
      };
    };

    const paint = (paintProps: {
      bbox: BBox;
      transform: Transform;
      children: JSX.Element;
      customData?: any;
    }) => {
      return (
        <Show
          when={paintProps.customData}
          fallback={<g>{paintProps.children}</g>}
        >
          <g
            transform={`translate(${paintProps.transform.translate.x ?? 0}, ${
              paintProps.transform.translate.y ?? 0
            })`}
          >
            <line
              x1={paintProps.customData.fromX}
              x2={paintProps.customData.toX}
              y1={paintProps.customData.fromY}
              y2={paintProps.customData.toY}
              stroke={props.stroke}
              stroke-width={props.strokeWidth}
            ></line>
            {paintProps.children}
          </g>
        </Show>
      );
    };

    return (
      <Layout name={props.name} layout={layout} paint={paint}>
        {props.children}
      </Layout>
    );
  },
  { displayName: "Line" }
);

export default Line;
