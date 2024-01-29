import { createSignal, For } from "solid-js";
import { RelationNode, ObjectNode } from "./traversal-rel-obj";
import dagre from "dagre";

type Id = string;
export type RelObjVisualizerComponentProps = {
  objectNodes: ObjectNode[];
  relationNodes: RelationNode[];
};

export const RelObjGraphVisualizer = (
  props: RelObjVisualizerComponentProps
) => {
  const calculateLayout = () => {
    // Create a new directed graph
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    const augmentedEdges: any = [];

    // Set nodes for ObjectNodes
    props.objectNodes.forEach((node) => {
      g.setNode(node.id, { label: node.description, width: 80, height: 20 }); // Adjust width and height as needed
      node.children.forEach((childId) => {
        g.setEdge(node.id, childId);
        augmentedEdges.push({ from: node.id, to: childId, type: "object" });
      });
    });

    // Set nodes for RelationNodes
    props.relationNodes.forEach((node) => {
      g.setNode(node.id, { label: node.description, width: 80, height: 40 }); // Adjust width and height as needed
      node.members.forEach((memberId) => {
        g.setEdge(node.id, memberId);
        augmentedEdges.push({ from: node.id, to: memberId, type: "relation" });
      });
    });

    // Compute the layout (synchronous)
    dagre.layout(g);

    const augmentedNodes = g.nodes().map((node) => {
      const dagreNode = g.node(node);
      const originalNode =
        props.objectNodes.find((n) => n.id === node) ||
        props.relationNodes.find((n) => n.id === node);

      // Determine the type of the node
      let type = "object";
      if (originalNode && "members" in originalNode) {
        type = "relation";
      }

      return { ...dagreNode, id: node, type: type };
    });

    // Extract the nodes and edges from the graph
    const nodes = g.nodes().map((node) => ({ ...g.node(node), id: node }));

    // Calculate SVG dimensions
    const svgWidth = Math.max(...nodes.map((node) => node.x + node.width)) + 50;
    const svgHeight =
      Math.max(...nodes.map((node) => node.y + node.height)) + 50;

    return {
      nodes: augmentedNodes,
      edges: augmentedEdges,
      svgWidth,
      svgHeight,
    };
  };

  const getEdgePath = (edge: any) => {
    console.log(edge);
    const fromNode = layout().nodes.find((node) => node.id === edge.from);
    const toNode = layout().nodes.find((node) => node.id === edge.to);

    if (!fromNode || !toNode) return "";

    // Calculate edge path considering node dimensions
    const fromX = fromNode.x + (fromNode.type === "relation" ? 20 : 0);
    const fromY = fromNode.y + fromNode.height / 2;
    const toX = toNode.x;
    const toY = toNode.y - toNode.height / 2;

    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  };

  const [layout, setLayout] = createSignal(calculateLayout());

  return (
    <svg
      width={layout().svgWidth}
      height={layout().svgHeight}
      style={{ "padding-left": "10px" }}
    >
      <For each={layout().nodes}>
        {(node) => (
          <g
            transform={`translate(${node.x - node.width / 2}, ${
              node.y - node.height / 2
            })`}
          >
            {node.type === "object" ? (
              <rect width="80" height="20" fill="lightblue" />
            ) : (
              <ellipse
                cx="60"
                cy="20"
                rx="60"
                ry="20"
                fill="purple"
                opacity={0.5}
              />
            )}
            <text
              x={node.type === "object" ? 40 : 60}
              y={node.type === "object" ? 10 : 20}
              font-size={node.type === "object" ? "15px" : "12px"}
              text-anchor="middle"
              dominant-baseline="central"
            >
              {node.label}
            </text>
          </g>
        )}
      </For>
      <For each={layout().edges}>
        {(edge) => (
          <path
            d={getEdgePath(edge)}
            stroke={edge.type === "relation" ? "purple" : "green"}
            fill="none"
            marker-end={
              edge.type === "relation"
                ? "url(#arrowhead-purple)"
                : "url(#arrowhead-green)"
            }
          />
        )}
      </For>
      <defs>
        {/* Black arrowhead for object edges */}
        <marker
          id="arrowhead-green"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="green" />
        </marker>
        {/* Purple arrowhead for relation edges */}
        <marker
          id="arrowhead-purple"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="purple" />
        </marker>
      </defs>
    </svg>
  );
};
