import {
  JSX,
  ParentProps,
  Show,
  createEffect,
  mergeProps,
  splitProps,
  untrack,
} from "solid-js";
import Layout from "./layout";
import withBluefish from "./withBluefish";
import { BBox, Id, Transform, useScenegraph, ChildNode } from "./scenegraph";
import { PaperScope } from "paper";

// TODO: should be exported by Bluefish
export const maybeSub = (a: number | undefined, b: number | undefined) =>
  a !== undefined && b !== undefined ? a - b : undefined;

type PathProps = JSX.PathSVGAttributes<SVGPathElement> & {
  name: Id;
  d: string;
  x?: number;
  y?: number;
  position?: string;
  "aria-data"?: any;
};

export const Path = withBluefish((props: PathProps) => {
  props = mergeProps(
    {
      "stroke-width": "3",
      stroke: "black",
      position: "relative",
      fill: "none",
    },
    props
  );

  const canvas = document.createElement("canvas");
  const paperScope = new PaperScope();
  paperScope.setup(canvas);

  const layout = (childIds: ChildNode[]) => {
    childIds = Array.from(childIds);

    if (props.name.endsWith("DEBUG")) {
      debugger;
    }

    const path = new paperScope.Path(props.d);
    const bounds = path.bounds;

    return {
      transform: {
        translate: {
          x: props.position === "absolute" ? 0 : maybeSub(props.x, bounds.left),
          y: props.position === "absolute" ? 0 : maybeSub(props.y, bounds.top),
        },
      },
      bbox: {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      },
      customData: {
        path: path,
        "aria-data": props["aria-data"],
      },
    };
  };

  const paint = (paintProps: {
    transform: Transform;
    bbox: BBox;
    children: JSX.Element;
    customData?: any;
  }) => {
    const [_, rest] = splitProps(props, ["name", "x", "y", "d", "position"]);

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
          <path {...rest} d={paintProps.customData.path?.pathData ?? ""} />
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
});

export default Path;
